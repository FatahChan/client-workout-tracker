import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import NotFound from "./components/NotFound";

import { get, set, del } from "idb-keyval";
import {
  PersistedClient,
  Persister,
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";

export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createIDBPersister();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  Wrap: ({ children }) => {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, buster: "24-9-2024" }}
      >
        {children}
      </PersistQueryClientProvider>
    );
  },
  defaultNotFoundComponent: () => <NotFound />,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
