import Record from "@/components/record";
import Calendar from "@/components/ui/calendar";
import { getSelectedDay, setSelectedDay } from "@/store";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const selected = getSelectedDay();

  return (
    <div className="bg-secondary h-screen p-2">
      <div className="relative">
        <Calendar selected={selected} onSelect={setSelectedDay} />
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
