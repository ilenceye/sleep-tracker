import Record from "@/components/record";
import Calendar from "@/components/ui/calendar";
import {
  getTrackedDateRange,
  isNextMonthHasSleepRecord,
  isPrevMonthHasSleepRecord,
} from "@/service/db";
import { getSelectedDay, setSelectedDay } from "@/store";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const selected = getSelectedDay();
  const calendarRange = useLiveQuery(getTrackedDateRange);

  return (
    <div className="bg-secondary h-screen p-2">
      <div className="relative">
        <Calendar
          selected={selected}
          onSelect={setSelectedDay}
          range={calendarRange}
          onPreviousMonth={async (hanlder, { today }) => {
            const has = await isPrevMonthHasSleepRecord(today);
            has && hanlder();
          }}
          onNextMonth={async (handler, { today }) => {
            const has = await isNextMonthHasSleepRecord(today);
            has && handler();
          }}
        />
        <div className="absolute top-2 right-2">
          <Link to="/settings">
            <Settings size={20} />
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <Record />
      </div>
    </div>
  );
}
