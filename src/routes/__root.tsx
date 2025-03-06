import { useEffect } from "react";

import { initDb } from "@/service/db";
import { useLocalStorageStore } from "@/store/local-storage";
import { Outlet, createRootRoute } from "@tanstack/react-router";

// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const routine = useLocalStorageStore((state) => state.routine);

  useEffect(() => {
    initDb(routine);
  }, []);

  return (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
