import { Button } from "@/components/ui/button";
import { QueryClient } from "@tanstack/react-query";
import {
  CatchBoundary,
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => <Root />,
});

function ErrorBoundary({ reset }: { reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reset();
  }, [reset]);
  return (
    <div className="w-screen h-screen flex flex-col gap-4  justify-center items-center">
      <h1>Something went wrong </h1>
      <Button
        onClick={() => {
          router.navigate({ to: "/" });
        }}
      >
        Go Home
      </Button>
    </div>
  );
}

function Root() {
  return (
    <CatchBoundary getResetKey={() => "reset"} errorComponent={ErrorBoundary}>
      <div className="w-full px-2 py-4">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </CatchBoundary>
  );
}
