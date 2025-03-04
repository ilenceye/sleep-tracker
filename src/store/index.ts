import { startOfToday } from "date-fns";
import { create } from "zustand";

export const useStore = create(() => ({
  selectedDay: startOfToday(),
}));

export const getSelectedDay = () => useStore((state) => state.selectedDay);

export const setSelectedDay = (selected: Date) => {
  useStore.setState({ selectedDay: selected });
};
