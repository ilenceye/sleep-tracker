import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-secondary h-screen p-2">
      <SettingsHeader />
    </div>
  );
}

function SettingsHeader() {
  return (
    <div className="relative text-center">
      <div className="absolute">
        <Link to="/">
          <ArrowLeft size={20} />
        </Link>
      </div>
      <h2 className="font-bold">设置</h2>
    </div>
  );
}
