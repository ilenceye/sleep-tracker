import { Checkbox } from "@/components/ui/checkbox";
import { SleepRecord, db, getSleepRecord } from "@/service/db";
import { getSelectedDay } from "@/store";
import { useLiveQuery } from "dexie-react-hooks";
import { Moon, Sun } from "lucide-react";

const sleepTime = {
  sleep: "11:30",
  wake: "7:30",
};

export default function Record() {
  const selected = getSelectedDay();
  const record = useLiveQuery(() => getSleepRecord(selected), [selected]);

  if (!record) return null;

  return (
    <div className="space-y-3">
      <TimeRecord type="wake" time={sleepTime.wake} record={record} />
      <TimeRecord type="sleep" time={sleepTime.sleep} record={record} />
    </div>
  );
}

// -- TimeRecord --

type TimeRecordProps = {
  time: string;
  type: "wake" | "sleep";
  record: SleepRecord;
};

function TimeRecord({ time, type, record }: TimeRecordProps) {
  const handleChecked = async (checked: boolean) => {
    await db.sleeps.update(
      record.id,
      type === "sleep" ? { sleepOnTime: checked } : { wakeOnTime: checked },
    );
  };

  return (
    <label
      htmlFor={`${type}-record`}
      className="bg-card flex items-center justify-between rounded p-4"
    >
      <div className="flex items-center gap-2">
        {type === "wake" ? <Sun /> : <Moon />} {time}
      </div>
      <Checkbox
        id={`${type}-record`}
        checked={type === "sleep" ? record.sleepOnTime : record.wakeOnTime}
        onCheckedChange={handleChecked}
      />
    </label>
  );
}
