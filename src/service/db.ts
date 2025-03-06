import { Routine } from "@/store/local-storage";
import { eachDayOfInterval, isEqual, startOfToday } from "date-fns";
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
        date: day,
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
