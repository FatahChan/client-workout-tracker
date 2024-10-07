import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "../ui/button";

function NotFound() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isIndexPage = useMemo(
    () => routerState.location.pathname.includes("/index.html"),
    [routerState.location.pathname]
  );

  if (isIndexPage || routerState.isLoading) return null;

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <Button onClick={() => navigate({ to: "/" })}>Go to Home</Button>
    </div>
  );
}

export default NotFound;
