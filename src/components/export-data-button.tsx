import { Button } from "@/components/ui/button";
import { download } from "@/lib/helpers";
import { SleepRecord, getAllSleepRecords } from "@/service/db";
import { format } from "date-fns";

export default function ExportDataButton() {
  const handleExport = async () => {
    // 1. get data
    const data = await getAllSleepRecords();

    if (data.length === 0) return;

    // 2. generate content
    const text = generateContentFromData(data);

    // 3. export file
    download(text, "sleep-tracker-data.txt", "text/plain");
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      导出
    </Button>
  );
}

const generateContentFromData = (data: SleepRecord[]) => {
  return data
    .map(
      ({ date, sleepOnTime, wakeOnTime }) =>
        `${format(date, "yyyy-MM-dd")} 07:30~23:00 ${wakeOnTime ? "1" : "0"} ${sleepOnTime ? "1" : "0"}`,
    )
    .join("\n");
};
