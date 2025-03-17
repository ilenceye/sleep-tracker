import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/classnames";
import { useLocalStorageStore } from "@/store/local-storage";

export default function WeekStartsOnSelect() {
  const weekStartsOn = useLocalStorageStore((state) => state.weekStartsOn);
  const updateWeekStartsOn = useLocalStorageStore(
    (state) => state.updateWeekStartsOn,
  );

  const handleSelect = (value: string) => {
    const input = parseInt(value);

    if (input === 0 || input === 1) {
      updateWeekStartsOn(input);
    } else {
      throw new Error("Invalid week start value. Must be 0 or 1.");
    }
  };

  return (
    <Select value={weekStartsOn.toString()} onValueChange={handleSelect}>
      <SelectTrigger
        className={cn(
          "data-[state=open]:bg-card w-full rounded-none border-0 bg-transparent p-4 shadow-none focus:ring-0 focus:ring-offset-0",
        )}
      >
        <span className="text-primary mr-auto">一周开始日</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        <SelectItem value="0">星期日</SelectItem>
        <SelectItem value="1">星期一</SelectItem>
      </SelectContent>
    </Select>
  );
}
