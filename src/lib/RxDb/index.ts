import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxReplicationState } from "rxdb/plugins/replication";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { ClientDocType, DatabaseCollections, schemas } from "./schema";

export let db: RxDatabase<DatabaseCollections>;
export let clientsCollectionReplicationState: RxReplicationState<
  ClientDocType,
  ClientDocType | undefined | null
>;
export async function getDataBaseInstance() {
  if (db) {
    return db;
  }
  if (import.meta.env.MODE === "development") {
    await import("rxdb/plugins/dev-mode").then((module) =>
      addRxPlugin(module.RxDBDevModePlugin)
    );
  }
  addRxPlugin(RxDBQueryBuilderPlugin);

  db = await createRxDatabase<DatabaseCollections>({
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
  db.clients.preRemove((data) => {
    db.pages.find().where({ clientId: data.id }).remove();
  }, true);
  db.pages.preRemove((data) => {
    db.sections.find().where({ pageId: data.id }).remove();
  }, true);
  db.sections.preRemove((data) => {
    db.exercises.find().where({ sectionId: data.id }).remove();
  }, true);

  return db;
}
