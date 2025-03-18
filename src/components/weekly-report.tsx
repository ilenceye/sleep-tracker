import { SleepRecord, getWeeklyData } from "@/service/db";
import { addDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useLiveQuery } from "dexie-react-hooks";

export default function WeeklyReport({ startOfWeek }: { startOfWeek: Date }) {
  const records = useLiveQuery(() => getWeeklyData(startOfWeek), [startOfWeek]);

  if (!records) return;

  const weekly = generateWeekly(records);

  return (
    <div className="bg-card rounded-md p-4">
      <code className="text-[15px] whitespace-pre tabular-nums">{weekly}</code>
    </div>
  );
}

const generateWeekly = (records: SleepRecord[]) => {
  const startOfWeek = format(records[0].date, "M月d日", { locale: zhCN });
  const endOfWeek = format(addDays(records[0].date, 6), "M月d日", {
    locale: zhCN,
  });

  const wakeTime = records[0].wakeTime;
  const sleepTime = records[0].sleepTime;

  let wakeOnTimeCount = 0;
  let sleepOnTimeCount = 0;

  const dailies: string[] = [];

  records.forEach((record) => {
    dailies.push(
      `${format(record.date, "MM.dd")} ${record.wakeOnTime ? 1 : 0} ${record.sleepOnTime ? 1 : 0}`,
    );

    record.wakeOnTime && wakeOnTimeCount++;
    record.sleepOnTime && sleepOnTimeCount++;
  });

  return [
    `${startOfWeek}-${endOfWeek}\n`,
    ...dailies,
    `\n早上 ${wakeTime} 起床, 达成率 ${wakeOnTimeCount}/7`,
    `晚上 ${sleepTime} 睡觉, 达成率 ${sleepOnTimeCount}/7`,
  ].join("\n");
};
