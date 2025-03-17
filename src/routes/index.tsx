import MainDropdown from "@/components/main-dropdown";
import Record from "@/components/record";
import Calendar from "@/components/ui/calendar";
import {
  getTrackedDateRange,
  isNextMonthHasSleepRecord,
  isPrevMonthHasSleepRecord,
} from "@/service/db";
import { getSelectedDay, setSelectedDay } from "@/store";
import { useLocalStorageStore } from "@/store/local-storage";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const selected = getSelectedDay();
  const calendarRange = useLiveQuery(getTrackedDateRange);
  const weekStartsOn = useLocalStorageStore((state) => state.weekStartsOn);

  return (
    <div className="bg-secondary h-screen p-2">
      <div className="relative">
        <Calendar
          selected={selected}
          onSelect={setSelectedDay}
          range={calendarRange}
          weekStartsOn={weekStartsOn}
          onPreviousMonth={async (hanlder, { today }) => {
            const has = await isPrevMonthHasSleepRecord(today);
            has && hanlder();
          }}
          onNextMonth={async (handler, { today }) => {
            const has = await isNextMonthHasSleepRecord(today);
            has && handler();
          }}
        />
        <div className="absolute top-2 right-2 flex items-center">
          <MainDropdown />
        </div>
      </div>
      <div className="mt-6">
        <Record />
      </div>
    </div>
  );
}
