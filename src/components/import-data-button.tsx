import { useRef } from "react";

import { buttonVariants } from "@/components/ui/button";
import { SleepRecord, insertSleepRecords } from "@/service/db";
import { startOfDay } from "date-fns";

export default function ImportDataButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileList = event.target.files;

    if (!fileList) return;

    const file = fileList[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load", () => {
      const data = transformRawToData(reader.result as string);
      insertSleepRecords(data);
    });
  };

  return (
    <>
      <label
        htmlFor="import-data"
        className={buttonVariants({ variant: "outline" })}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        导入
      </label>
      <input
        className="hidden"
        type="file"
        id="import-data"
        accept=".txt"
        ref={inputRef}
        onChange={handleChange}
      />
    </>
  );
}

const transformRawToData = (raw: string) => {
  return raw.split("\n").map((str) => {
    const s = str.split(" ");
    const item: Omit<SleepRecord, "id"> = {
      date: startOfDay(s[0]),
      wakeTime: s[1].slice(0, 5),
      sleepTime: s[1].slice(6, 11),
      wakeOnTime: s[2] === "1",
      sleepOnTime: s[3] === "1",
    };
    return item;
  });
};
