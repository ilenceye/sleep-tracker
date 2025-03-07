import { Routine } from "@/store/local-storage";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns";
import Dexie, { EntityTable } from "dexie";

interface SleepRecord extends Routine {
  id: number;
  date: Date;
  sleepOnTime: boolean;
  wakeOnTime: boolean;
}

interface Db extends Dexie {
  sleeps: EntityTable<SleepRecord, "id">;
}

export type { SleepRecord };

// --

export const db = new Dexie("db") as Db;

db.version(1).stores({
  sleeps: "++id, date, sleepOnTime, wakeOnTime",
});

// --

export const initDb = async (routine: Routine) => {
  const today = startOfToday();
  const lastItem = await db.sleeps.orderBy("date").last(); // undefied, today, day before today

  if (lastItem) {
    const lastTrackedDay = lastItem.date;

    if (isEqual(lastTrackedDay, today)) return;

    const days = eachDayOfInterval({
      start: lastTrackedDay,
      end: today,
    });

    await db.sleeps.bulkAdd(
      days.map((day) => ({
        date: startOfDay(day),
        ...routine,
        sleepOnTime: false,
        wakeOnTime: false,
      })),
    );
  } else {
    await db.sleeps.add({
      date: startOfToday(),
      ...routine,
      sleepOnTime: false,
      wakeOnTime: false,
    });
  }
};

export const getSleepRecord = async (date: Date) => {
  const item = await db.sleeps.where({ date }).first();
  return item;
};

export const getAllSleepRecords = async () => {
  const data = await db.sleeps.toArray();
  return data;
};

export const insertSleepRecords = async (data: Omit<SleepRecord, "id">[]) => {
  // if not exist, insert
  // if exist, update

  // for (const item of data) {
  //   await db.sleeps.where("date").equals(item.date).delete();
  // }

  await db.sleeps.clear();

  await db.sleeps.bulkAdd(data);
};

export const getTrackedDateRange = async (): Promise<[Date, Date]> => {
  const first = await db.sleeps.orderBy("id").first();
  const last = await db.sleeps.orderBy("id").last();
  return [first?.date || startOfToday(), last?.date || startOfToday()];
};

export const isPrevMonthHasSleepRecord = async (today: Date) => {
  // get final day of last month
  // check if there is an item has same day of above
  const lastDayOfLastMonth = startOfDay(endOfMonth(subMonths(today, 1)));
  const record = await db.sleeps
    .filter((enrty) => isEqual(enrty.date, lastDayOfLastMonth))
    .first();
  return !!record;
};

export const isNextMonthHasSleepRecord = async (today: Date) => {
  const firstDayOfNextMonth = startOfDay(startOfMonth(addMonths(today, 1)));
  const record = await db.sleeps
    .filter((entry) => isEqual(entry.date, firstDayOfNextMonth))
    .first();
  return !!record;
};
