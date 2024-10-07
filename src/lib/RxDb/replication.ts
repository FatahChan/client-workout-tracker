import {
  createClient,
  createExercise,
  createPage,
  createSection,
  deleteClient,
  deleteExercise,
  deletePage,
  deleteSection,
  updateClient,
  updateExercise,
  updateSection,
} from "@/lib/appwrite/mutations";
import {
  getClient,
  getExercise,
  getPage,
  getSection,
  listAllClients,
  listAllExercises,
  listAllPages,
  listAllSections,
} from "@/lib/appwrite/queries";
import { Query } from "appwrite";
import { WithDeleted } from "rxdb";
import {
  replicateRxCollection,
  RxReplicationState,
} from "rxdb/plugins/replication";
import { db, getDataBaseInstance } from ".";
import {
  ClientDocument,
  ExerciseDocument,
  PageDocument,
  SectionDocument,
} from "../appwrite/types";
import {
  ClientDocType,
  ExerciseDocType,
  PageDocType,
  SectionDocType,
} from "./schema";
import { convertAppwriteDocumentToRxDBDocumentData } from "./schema/utils";

let clientsCollectionReplicationState: RxReplicationState<
  ClientDocType,
  ClientDocType | undefined
>;
let pagesCollectionReplicationState: RxReplicationState<
  PageDocType,
  PageDocType | undefined
>;

let sectionsCollectionReplicationState: RxReplicationState<
  SectionDocType,
  SectionDocType | undefined
>;

let exercisesCollectionReplicationState: RxReplicationState<
  ExerciseDocType,
  ExerciseDocType | undefined
>;

export async function getClientReplicationState(
  newReplication: boolean = false
) {
  if (!db) {
    await getDataBaseInstance();
  }

  if (clientsCollectionReplicationState) {
    if (!newReplication) return clientsCollectionReplicationState;
    clientsCollectionReplicationState.cancel();
    clientsCollectionReplicationState.remove();
  }
  clientsCollectionReplicationState = replicateRxCollection<
    ClientDocType,
    ClientDocType | undefined
  >({
    collection: db.clients,
    replicationIdentifier: "clientsReplication",

    push: {
      handler: async (changeRows) => {
        const conflicts = [];
        for (const row of changeRows) {
          const realMasterDoc = await getClient(row.newDocumentState.id);
          const realMasterDocMapped = convertAppwriteDocumentToRxDBDocumentData<
            ClientDocument,
            WithDeleted<ClientDocType>
          >(realMasterDoc);

          const isDeleted = row.newDocumentState._deleted;

          if (!realMasterDocMapped && isDeleted) {
            continue;
          }
          if (!realMasterDocMapped) {
            await createClient(
              {
                name: row.newDocumentState.name,
                age: row.newDocumentState.age,
                bodyType: row.newDocumentState.bodyType,
                goal: row.newDocumentState.goal,
              },
              row.newDocumentState.id
            );
            continue;
          }

          if (isDeleted) {
            await deleteClient(row.newDocumentState.id);
            continue;
          }

          const doesUpdateTimeMatch =
            realMasterDocMapped?.updatedAt === row.newDocumentState.updatedAt;

          const doesAssumedMasterStateExist = !!row.assumedMasterState;

          const isConflicting =
            doesAssumedMasterStateExist && !doesUpdateTimeMatch;

          if (isConflicting) {
            conflicts.push(realMasterDocMapped);
            continue;
          }

          await updateClient(row.newDocumentState.id, {
            name: row.newDocumentState.name,
            age: row.newDocumentState.age,
            bodyType: row.newDocumentState.bodyType,
            goal: row.newDocumentState.goal,
          });
        }
        return conflicts;
      },
    },
    pull: {
      handler: async (checkPoint?: ClientDocType, batchSize = 25) => {
        const checkpointUpdatedAt = checkPoint?.updatedAt
          ? new Date(checkPoint.updatedAt).toISOString()
          : new Date(0).toISOString();
        const { documents: clientsDocuments } = await listAllClients([
          /* eslint-disable no-useless-escape */
          // prettier-ignore
          Query.greaterThanEqual("\$updatedAt", checkpointUpdatedAt),
          Query.limit(batchSize),
          /* eslint-enable no-useless-escape */
        ]);
        const mappedClientsDocuments = clientsDocuments.reduce<
          WithDeleted<ClientDocType>[]
        >((acc, doc) => {
          const convertedDoc =
            convertAppwriteClientDocumentToRxDBClientDocumentData(doc);
          acc.push(convertedDoc);
          return acc;
        }, []);
        const newCheckpoint =
          mappedClientsDocuments.length > 0
            ? mappedClientsDocuments[mappedClientsDocuments.length - 1]
            : checkPoint;
        return {
          documents: mappedClientsDocuments,
          checkpoint: newCheckpoint,
        };
      },
    },
  });
  return clientsCollectionReplicationState;
}

export async function getPageReplicationState(newReplication: boolean = false) {
  if (!db) {
    await getDataBaseInstance();
  }

  if (pagesCollectionReplicationState && !newReplication) {
    return pagesCollectionReplicationState;
  }

  pagesCollectionReplicationState = replicateRxCollection<
    PageDocType,
    PageDocType | undefined
  >({
    collection: db.pages,
    replicationIdentifier: "pagesReplication",

    push: {
      handler: async (changeRows) => {
        const conflicts = [];
        for (const row of changeRows) {
          const realMasterDoc = await getPage(row.newDocumentState.id);
          const realMasterDocMapped = convertAppwriteDocumentToRxDBDocumentData<
            PageDocument,
            WithDeleted<PageDocType>
          >(realMasterDoc);

          const isDeleted = row.newDocumentState._deleted;

          if (!realMasterDocMapped && isDeleted) {
            continue;
          }

          if (!realMasterDocMapped) {
            await createPage(
              row.newDocumentState.clientId,
              row.newDocumentState.id
            );
            continue;
          }

          if (isDeleted) {
            await deletePage(row.newDocumentState.id);
            continue;
          }

          const doesUpdateTimeMatch =
            realMasterDocMapped?.updatedAt === row.newDocumentState.updatedAt;

          const doesAssumedMaster = !!row.assumedMasterState;

          const isConflicting = doesAssumedMaster && !doesUpdateTimeMatch;

          if (isConflicting) {
            conflicts.push(realMasterDocMapped);
            continue;
          }

          // placeholder for updatePage
          //   await updatePage(row.newDocumentState.id, {});
        }
        return conflicts;
      },
    },
    pull: {
      handler: async (checkPoint?: PageDocType, batchSize = 25) => {
        const checkpointUpdatedAt = checkPoint?.updatedAt
          ? new Date(checkPoint.updatedAt).toISOString()
          : new Date(0).toISOString();
        const { documents: pagesDocuments } = await listAllPages([
          Query.greaterThanEqual("$updatedAt", checkpointUpdatedAt),
          Query.limit(batchSize),
        ]);
        const mappedPagesDocuments = pagesDocuments.reduce<
          WithDeleted<PageDocType>[]
        >((acc, doc) => {
          const convertedDoc =
            convertAppwritePageDocumentToRxDBPageDocumentData(doc);
          acc.push(convertedDoc);
          return acc;
        }, []);
        const newCheckpoint =
          mappedPagesDocuments.length > 0
            ? mappedPagesDocuments[mappedPagesDocuments.length - 1]
            : checkPoint;
        return {
          documents: mappedPagesDocuments,
          checkpoint: newCheckpoint,
        };
      },
    },
  });
}

export async function getSectionReplicationState() {
  if (!db) {
    await getDataBaseInstance();
  }
  if (sectionsCollectionReplicationState) {
    return sectionsCollectionReplicationState;
  }

  sectionsCollectionReplicationState = replicateRxCollection<
    SectionDocType,
    SectionDocType | undefined
  >({
    collection: db.sections,
    replicationIdentifier: "sectionsReplication",

    push: {
      handler: async (changeRows) => {
        const conflicts = [];
        for (const row of changeRows) {
          const realMasterDoc = await getSection(row.newDocumentState.id);
          const realMasterDocMapped = convertAppwriteDocumentToRxDBDocumentData<
            SectionDocument,
            WithDeleted<SectionDocType>
          >(realMasterDoc);

          const isDeleted = row.newDocumentState._deleted;

          if (!realMasterDocMapped && isDeleted) {
            continue;
          }

          if (!realMasterDocMapped) {
            await createSection(
              row.newDocumentState.pageId,
              {
                name: row.newDocumentState.name,
              },
              row.newDocumentState.id
            );
            continue;
          }

          if (isDeleted) {
            await deleteSection(row.newDocumentState.id);
            continue;
          }

          const doesUpdateTimeMatch =
            realMasterDocMapped?.updatedAt === row.newDocumentState.updatedAt;
          const doesAssumedMaster = !!row.assumedMasterState;

          const isConflicting = doesAssumedMaster && !doesUpdateTimeMatch;

          if (isConflicting) {
            conflicts.push(realMasterDocMapped);
            continue;
          }

          await updateSection(row.newDocumentState.id, {
            name: row.newDocumentState.name,
          });
        }
        return [];
      },
    },
    pull: {
      handler: async (checkPoint?: SectionDocType, batchSize = 25) => {
        const checkpointUpdatedAt = checkPoint?.updatedAt
          ? new Date(checkPoint.updatedAt).toISOString()
          : new Date(0).toISOString();
        const { documents: sectionsDocuments } = await listAllSections([
          Query.greaterThanEqual("$updatedAt", checkpointUpdatedAt),
          Query.limit(batchSize),
        ]);
        const mappedSectionsDocuments = sectionsDocuments.reduce<
          WithDeleted<SectionDocType>[]
        >((acc, doc) => {
          const convertedDoc =
            convertAppwriteSectionDocumentToRxDBSectionDocumentData(doc);
          acc.push(convertedDoc);
          return acc;
        }, []);
        const newCheckpoint =
          mappedSectionsDocuments.length > 0
            ? mappedSectionsDocuments[mappedSectionsDocuments.length - 1]
            : checkPoint;

        return {
          documents: mappedSectionsDocuments,
          checkpoint: newCheckpoint,
        };
      },
    },
  });
}

export async function getExerciseReplicationState(
  newReplication: boolean = false
) {
  if (!db) {
    await getDataBaseInstance();
  }
  if (exercisesCollectionReplicationState) {
    if (!newReplication) return exercisesCollectionReplicationState;
    exercisesCollectionReplicationState.cancel();
    exercisesCollectionReplicationState.remove();
  }

  exercisesCollectionReplicationState = replicateRxCollection<
    ExerciseDocType,
    ExerciseDocType | undefined
  >({
    collection: db.exercises,
    replicationIdentifier: "exercisesReplication",

    push: {
      handler: async (changeRows) => {
        const conflicts = [];

        console.log("changeRows", changeRows);
        for (const row of changeRows) {
          const realMasterDoc = await getExercise(row.newDocumentState.id);
          const realMasterDocMapped = convertAppwriteDocumentToRxDBDocumentData<
            ExerciseDocument,
            WithDeleted<ExerciseDocType>
          >(realMasterDoc);

          const isDeleted = row.newDocumentState._deleted;

          if (!realMasterDocMapped && isDeleted) {
            continue;
          }

          if (!realMasterDocMapped) {
            await createExercise(
              row.newDocumentState.sectionId,
              {
                name: row.newDocumentState.name,
                sets: row.newDocumentState.sets,
                reps: row.newDocumentState.reps,
                weight: row.newDocumentState.weight,
              },
              row.newDocumentState.id
            );
            continue;
          }

          if (isDeleted) {
            await deleteExercise(row.newDocumentState.id);
            continue;
          }

          const doesUpdateTimeMatch =
            realMasterDocMapped?.updatedAt === row.newDocumentState.updatedAt;
          const doesAssumedMaster = !!row.assumedMasterState;

          const isConflicting = doesAssumedMaster && !doesUpdateTimeMatch;

          if (isConflicting) {
            conflicts.push(realMasterDocMapped);
            continue;
          }

          await updateExercise(row.newDocumentState.id, {
            name: row.newDocumentState.name,
            sets: row.newDocumentState.sets,
            reps: row.newDocumentState.reps,
            weight: row.newDocumentState.weight,
          });
        }
        return conflicts;
      },
    },
    pull: {
      handler: async (checkPoint?: ExerciseDocType, batchSize = 25) => {
        const checkpointUpdatedAt = checkPoint?.updatedAt
          ? new Date(checkPoint.updatedAt).toISOString()
          : new Date(0).toISOString();
        const { documents: exercisesDocuments } = await listAllExercises([
          Query.greaterThanEqual("$updatedAt", checkpointUpdatedAt),
          Query.limit(batchSize),
        ]);
        const mappedExercisesDocuments = exercisesDocuments.reduce<
          WithDeleted<ExerciseDocType>[]
        >((acc, doc) => {
          const convertedDoc =
            convertAppwriteExerciseDocumentToRxDBExerciseDocumentData(doc);
          acc.push(convertedDoc);
          return acc;
        }, []);

        const newCheckpoint =
          mappedExercisesDocuments.length > 0
            ? mappedExercisesDocuments[mappedExercisesDocuments.length - 1]
            : checkPoint;

        return {
          documents: mappedExercisesDocuments,
          checkpoint: newCheckpoint,
        };
      },
    },
  });
}

export async function startReplication() {
  await getDataBaseInstance();
  await Promise.all([
    getClientReplicationState(),
    getPageReplicationState(),
    getSectionReplicationState(),
    getExerciseReplicationState(),
  ]);
}

function convertAppwriteClientDocumentToRxDBClientDocumentData(
  doc: ClientDocument
): WithDeleted<ClientDocType> {
  return {
    id: doc.$id,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    name: doc.name,
    age: doc.age,
    bodyType: doc.bodyType,
    goal: doc.goal,
    _deleted: false,
  };
}

function convertAppwritePageDocumentToRxDBPageDocumentData(
  doc: PageDocument
): WithDeleted<PageDocType> {
  return {
    id: doc.$id,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    clientId: doc.client.$id,
    _deleted: false,
  };
}

function convertAppwriteSectionDocumentToRxDBSectionDocumentData(
  doc: SectionDocument
): WithDeleted<SectionDocType> {
  return {
    id: doc.$id,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    pageId: doc.page.$id,
    name: doc.name,
    _deleted: false,
  };
}

function convertAppwriteExerciseDocumentToRxDBExerciseDocumentData(
  doc: ExerciseDocument
): WithDeleted<ExerciseDocType> {
  return {
    id: doc.$id,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    sectionId: doc.section.$id,
    name: doc.name,
    sets: doc.sets,
    reps: doc.reps,
    weight: doc.weight,
    _deleted: false,
  };
}
