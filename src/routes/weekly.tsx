import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import WeeklyControls from "@/components/weekly-controls";
import WeeklyReport from "@/components/weekly-report";
import { useLocalStorageStore } from "@/store/local-storage";
import { createFileRoute } from "@tanstack/react-router";
import { startOfWeek as getStartOfWeek, startOfToday } from "date-fns";

export const Route = createFileRoute("/weekly")({
  component: RouteComponent,
});

function RouteComponent() {
  const weekStartsOn = useLocalStorageStore((s) => s.weekStartsOn);
  const startOfThisWeek = getStartOfWeek(startOfToday(), { weekStartsOn });
  const [startOfWeek, setStartOfWeek] = useState(startOfThisWeek);

  return (
    <Container className="flex flex-col gap-6">
      <Header label="周报" />
      <WeeklyReport startOfWeek={startOfWeek} />
      <WeeklyControls
        className="mt-auto"
        startOfThisWeek={startOfThisWeek}
        startOfWeek={startOfWeek}
        onStartOfWeekChange={setStartOfWeek}
      />
    </Container>
  );
}
