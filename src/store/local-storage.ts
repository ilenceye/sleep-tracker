import { WeekStartOn } from "@/components/ui/calendar";
import { ROUTINE } from "@/config/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Routine = { sleepTime: string; wakeTime: string };

type LocalStorageStore = {
  routine: Routine;
  updateRoutine: (value: Routine) => void;
  weekStartsOn: WeekStartOn;
  updateWeekStartsOn: (value: WeekStartOn) => void;
};

export const useLocalStorageStore = create<LocalStorageStore>()(
  persist(
    (set) => ({
      // ==
      routine: ROUTINE,
      updateRoutine: (value: Routine) => set({ routine: value }),
      // ==
      weekStartsOn: 0,
      updateWeekStartsOn: (value: WeekStartOn) => set({ weekStartsOn: value }),
    }),
    {
      name: "sleep-tracker",
    },
  ),
);
