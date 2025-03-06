import ExportDataButton from "@/components/export-data-button";
import ImportDataButton from "@/components/import-data-button";
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
      <DataSettingsItem title="导入数据" action={<ImportDataButton />} />
      <DataSettingsItem title="导出数据" action={<ExportDataButton />} />
    </div>
  );
}

function DataSettingsItem({
  title,
  action,
}: {
  title: string;
  action: React.ReactNode;
}) {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div>
          <p>{title}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
