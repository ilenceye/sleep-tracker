import { ROUTINE } from "@/config/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Routine = { sleepTime: string; wakeTime: string };

type LocalStorageStore = {
  routine: Routine;
  updateRoutine: (value: Routine) => void;
};

export const useLocalStorageStore = create<LocalStorageStore>()(
  persist(
    (set) => ({
      routine: ROUTINE,
      updateRoutine: (value: Routine) => set({ routine: value }),
    }),
    {
      name: "sleep-tracker",
    },
  ),
);
