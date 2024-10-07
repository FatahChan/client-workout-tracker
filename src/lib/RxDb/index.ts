import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { DatabaseCollections, schemas } from "./schema";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

export let db: RxDatabase<DatabaseCollections>;
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

  const _db = await createRxDatabase<DatabaseCollections>({
    name: "clients-workout-tracker",
    storage: getRxStorageDexie(),
    multiInstance: true,
    eventReduce: true,
    ignoreDuplicate: true,
  });

  await _db.addCollections({
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
  _db.clients.preRemove((data) => {
    _db.pages.find().where({ clientId: data.id }).remove();
  }, true);
  _db.pages.preRemove((data) => {
    _db.sections.find().where({ pageId: data.id }).remove();
  }, true);
  _db.sections.preRemove((data) => {
    _db.exercises.find().where({ sectionId: data.id }).remove();
  }, true);

  db = _db;
  return _db;
}
