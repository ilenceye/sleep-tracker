import { cn } from "@/lib/classnames";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isToday,
  parse,
  startOfToday,
} from "date-fns";

type CalendarProps = {
  selected: Date;
  onSelect: (selected: Date) => void;
};

export default function Calendar(props: CalendarProps) {
  return (
    <>
      <CurrentMonth />
      <WeekSection />
      <DaySection {...props} />
    </>
  );
}

function CurrentMonth() {
  const today = startOfToday();
  const currentMonth = format(today, "yyyy-MM");

  return <div className="p-2 font-semibold text-gray-900">{currentMonth}</div>;
}

function WeekSection() {
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
      {weeks.map((week) => (
        <div key={week}>{week}</div>
      ))}
    </div>
  );
}

// --

type DaySectionProps = Pick<CalendarProps, "selected" | "onSelect">;

function DaySection({ selected, onSelect }: DaySectionProps) {
  const today = startOfToday();
  const currentMonth = format(today, "yyyy-MM");
  const firstDayOfCurrentMonth = parse(currentMonth, "yyyy-MM", new Date());

  const days = eachDayOfInterval({
    start: firstDayOfCurrentMonth,
    end: endOfMonth(firstDayOfCurrentMonth),
  });

  const getDayButtonClasses = (day: Date) => {
    const isToday_ = isToday(day);
    const isSelectedDay = isEqual(day, selected);

    return cn("size-8 flex items-center justify-center mx-auto rounded-full", {
      "text-white bg-gray-900": isSelectedDay,
      "hover:bg-gray-200": !isSelectedDay,
      "border border-gray-200": isToday_ && !isSelectedDay,
      "font-semibold": isToday_ || isSelectedDay,
    });
  };

  return (
    <div className="grid grid-cols-7 text-sm">
      {days.map((day, dayIdx) => (
        <div
          key={day.toString()}
          className={cn(dayIdx === 0 && colStartClasses[getDay(day)])}
        >
          <button
            type="button"
            className={getDayButtonClasses(day)}
            onClick={() => !isEqual(day, selected) && onSelect(day)}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>
        </div>
      ))}
    </div>
  );
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
