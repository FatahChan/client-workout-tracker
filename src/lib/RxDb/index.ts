import { addRxPlugin, createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { DatabaseCollections, schemas } from "./schema";
if (import.meta.env.MODE === "development") {
  await import("rxdb/plugins/dev-mode").then((module) =>
    addRxPlugin(module.RxDBDevModePlugin)
  );
}

const db = await createRxDatabase<DatabaseCollections>({
  name: "clients-workout-tracker",
  storage: getRxStorageDexie(),
  multiInstance: true,
  eventReduce: true,
  ignoreDuplicate: true,
});

await db.addCollections({
  clients: {
    schema: schemas.client,
  },
  pages: {
    schema: schemas.page,
  },
  sections: {
    schema: schemas.section,
  },
  exercises: {
    schema: schemas.exercise,
  },
});

export { db };
