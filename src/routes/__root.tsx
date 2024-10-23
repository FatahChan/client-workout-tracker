import { Button } from "@/components/ui/button";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import {
  CatchBoundary,
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import ReloadPrompt from "@/components/ReloadPrompt";

const TanStackRouterDevtools = lazy(() =>
  import("@tanstack/router-devtools").then(({ TanStackRouterDevtools }) => ({
    default: TanStackRouterDevtools,
  }))
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => <Root />,
});

function ErrorBoundary({
  reset,
  error,
}: {
  reset: () => void;
  error: unknown;
}) {
  const router = useRouter();
  useEffect(() => {
    reset();
  }, [reset]);
  const formattedError = (() => {
    if (error instanceof Error) {
      return error.message;
    }
    switch (typeof error) {
      case "string":
        return error;
      case "object":
        return JSON.stringify(error);
      default:
        return "An unknown error occurred";
    }
  })();

  return (
    <div className="w-screen h-screen flex flex-col gap-4  justify-center items-center">
      <h1>{formattedError}</h1>
      <Button
        onClick={() => {
          router.navigate({ to: "/clients" });
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
      <div className="w-full px-2 py-4 md:px-16 md:py-16 h-screen">
        <Outlet />
        {process.env.NODE_ENV === "development" && (
          <Suspense fallback={null}>
            <TanStackRouterDevtools />
          </Suspense>
        )}
      </div>
      <ReloadPrompt />
      <Toaster />
    </CatchBoundary>
  );
}
