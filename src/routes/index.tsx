import Record from "@/components/record";
import Calendar from "@/components/ui/calendar";
import { getSelectedDay, setSelectedDay } from "@/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const selected = getSelectedDay();

  return (
    <div className="bg-secondary h-screen p-2">
      <div className="">
        <Calendar selected={selected} onSelect={setSelectedDay} />
      </div>
      <div className="mt-6">
        <Record />
      </div>
    </div>
  );
}
