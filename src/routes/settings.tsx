import ExportDataButton from "@/components/export-data-button";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-secondary h-screen p-2">
      <div className="space-y-6">
        <SettingsHeader />
        <DataSettingsSection />
      </div>
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

function DataSettingsSection() {
  return (
    <div>
      <div className="text-sm font-bold">
        <h3>数据相关</h3>
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div>
            <p>导出数据</p>
          </div>
          <ExportDataButton />
        </div>
      </div>
    </div>
  );
}
