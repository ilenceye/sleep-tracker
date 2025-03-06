import { Routine } from "@/store/local-storage";
import { eachDayOfInterval, isEqual, startOfDay, startOfToday } from "date-fns";
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
