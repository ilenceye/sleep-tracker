import { Button } from "@/components/ui/button";
import { cn } from "@/lib/classnames";
import {
  getIsNextWeekHasSleepRecord,
  getIsPrevWeekHasSleepRecord,
} from "@/service/db";
import { addDays, isEqual, subDays } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

export default function WeeklyControls({
  className,
  startOfThisWeek,
  startOfWeek,
  onStartOfWeekChange,
  ...props
}: React.ComponentProps<"div"> & {
  startOfThisWeek: Date;
  startOfWeek: Date;
  onStartOfWeekChange: (value: Date) => void;
}) {
  const isPrevWeekHasSleepRecord = useLiveQuery(
    () => getIsPrevWeekHasSleepRecord(startOfWeek),
    [startOfWeek],
  );

  const isNextWeekHasSleepRecord = useLiveQuery(
    () => getIsNextWeekHasSleepRecord(startOfWeek),
    [startOfWeek],
  );

  return (
    <div className={cn("bg-card flex justify-between", className)} {...props}>
      <Button
        variant="ghost"
        disabled={!isPrevWeekHasSleepRecord}
        onClick={() => onStartOfWeekChange(subDays(startOfWeek, 7))}
      >
        上周
      </Button>
      {!isEqual(startOfWeek, startOfThisWeek) && (
        <Button
          variant="ghost"
          onClick={() => onStartOfWeekChange(startOfThisWeek)}
        >
          回到本周
        </Button>
      )}
      <Button
        variant="ghost"
        disabled={!isNextWeekHasSleepRecord}
        onClick={() => onStartOfWeekChange(addDays(startOfWeek, 7))}
      >
        下周
      </Button>
    </div>
  );
}
