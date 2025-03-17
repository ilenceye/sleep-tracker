import { useState } from "react";

import { useSwipe } from "@/hooks/use-swipe";
import { cn } from "@/lib/classnames";
import { createSafeContext } from "@/lib/react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isToday,
  isWithinInterval,
  parse,
  startOfToday,
  subMonths,
} from "date-fns";

export type WeekStartOn = 0 | 1; // 0 => sunday, 1 => monday

interface CalendarProps {
  selected: Date;
  range?: [Date, Date];
  weekStartsOn?: WeekStartOn;
  onSelect: (selected: Date) => void;
  onPreviousMonth?: (hanlder: () => void, options: { today: Date }) => void;
  onNextMonth?: (hanlder: () => void, options: { today: Date }) => void;
}

interface CalendarContext extends CalendarProps {
  today: Date;
  currentMonth: string;
  setToday: React.Dispatch<React.SetStateAction<Date>>;
  weekStartsOn: WeekStartOn;
}

const [CalendarProvider, useCalendarContext] =
  createSafeContext<CalendarContext>("CalendarProvider was not found in tree.");

export default function Calendar(props: CalendarProps) {
  const [today, setToday] = useState(startOfToday());
  const currentMonth = format(today, "yyyy-MM");

  const { weekStartsOn = 0, ...rest } = props;
  const value = { weekStartsOn, ...rest, today, currentMonth, setToday };

  return (
    <CalendarProvider value={value}>
      <CurrentMonth />
      <WeekSection />
      <DaySection />
    </CalendarProvider>
  );
}

function CurrentMonth() {
  const { currentMonth } = useCalendarContext();

  return <div className="p-2 font-semibold text-gray-900">{currentMonth}</div>;
}

function WeekSection() {
  const { weekStartsOn } = useCalendarContext();
  const weeks =
    weekStartsOn === 0
      ? ["日", "一", "二", "三", "四", "五", "六"]
      : ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
      {weeks.map((week) => (
        <div key={week}>{week}</div>
      ))}
    </div>
  );
}

// --

function DaySection() {
  const {
    selected,
    onSelect,
    range,
    today,
    currentMonth,
    weekStartsOn,
    setToday,
    onPreviousMonth,
    onNextMonth,
  } = useCalendarContext();

  const firstDayOfCurrentMonth = parse(currentMonth, "yyyy-MM", new Date());

  const days = eachDayOfInterval({
    start: firstDayOfCurrentMonth,
    end: endOfMonth(firstDayOfCurrentMonth),
  });

  const isWithinRange = (day: Date) =>
    range
      ? isWithinInterval(day, {
          start: range[0],
          end: range[1],
        })
      : true;

  const getDayButtonClasses = (day: Date) => {
    const isToday_ = isToday(day);
    const isSelectedDay = isEqual(day, selected);
    const isDisabled = !isWithinRange(day);

    return cn("size-8 flex items-center justify-center mx-auto rounded-full", {
      "text-white bg-gray-900": isSelectedDay && !isDisabled,
      "opacity-50": isDisabled,
      "hover:bg-gray-200": !isSelectedDay && !isDisabled,
      "border border-gray-200": isToday_ && !isSelectedDay,
      "font-semibold": isToday_ || isSelectedDay,
    });
  };

  // == handle swipe

  const swipe = useSwipe({
    onSwipeLeft: () => {
      const handler = () => {
        const previousMonthToday = subMonths(today, 1);
        const previousMonthSelectedDay = subMonths(selected, 1);
        setToday(previousMonthToday);
        onSelect(previousMonthSelectedDay);
      };

      onPreviousMonth ? onPreviousMonth(handler, { today }) : handler();
    },
    onSwipeRight: () => {
      const handler = () => {
        const nextMonthToday = addMonths(today, 1);
        const nextMonthSelectedDay = addMonths(selected, 1);
        setToday(nextMonthToday);
        onSelect(nextMonthSelectedDay);
      };

      onNextMonth ? onNextMonth(handler, { today }) : handler();
    },
  });

  return (
    <div
      className="grid grid-cols-7 text-sm"
      style={{ touchAction: "none" }}
      {...swipe()}
    >
      {days.map((day, dayIdx) => (
        <div
          key={day.toString()}
          className={cn(
            dayIdx === 0 && getColStartClasses(weekStartsOn)[getDay(day)],
          )}
        >
          <button
            type="button"
            className={getDayButtonClasses(day)}
            onClick={() => !isEqual(day, selected) && onSelect(day)}
            disabled={!isWithinRange(day)}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>
        </div>
      ))}
    </div>
  );
}

const getColStartClasses = (weekStartsOn: WeekStartOn) =>
  [
    [
      "",
      "col-start-2",
      "col-start-3",
      "col-start-4",
      "col-start-5",
      "col-start-6",
      "col-start-7",
    ],
    [
      "col-start-7",
      "",
      "col-start-2",
      "col-start-3",
      "col-start-4",
      "col-start-5",
      "col-start-6",
    ],
  ][weekStartsOn];
