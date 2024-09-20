import { Permission, Role } from "appwrite";
import {
  account,
  APPWRITE_CLIENTS_COLLECTION_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_EXERCISES_COLLECTION_ID,
  APPWRITE_PAGES_COLLECTION_ID,
  APPWRITE_SECTIONS_COLLECTION_ID,
  databases,
} from ".";
import {
  ClientDocument,
  Exercise,
  ExerciseDocument,
  PageDocument,
  Section,
  SectionDocument,
  User,
} from "./types";

const getFullAccessCurrentUser = (user: User) => {
  return [
    Permission.read(Role.user(user.$id)),
    Permission.write(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ];
};
export async function createClient(
  name: string,
  age: number,
  bodyType: string,
  goal: string
) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  const client = await databases.createDocument<ClientDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_CLIENTS_COLLECTION_ID,
    "unique()",
    {
      name,
      age,
      bodyType,
      goal,
    },
    getFullAccessCurrentUser(user)
  );
  return client;
}

export async function createPage(clientId: string) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  const page = await databases.createDocument<PageDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    "unique()",
    { client: clientId },
    getFullAccessCurrentUser(user)
  );
  return page;
}

export async function createSection(pageId: string, data: Section) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  const section = await databases.createDocument<SectionDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_SECTIONS_COLLECTION_ID,
    "unique()",
    { page: pageId, ...data },
    getFullAccessCurrentUser(user)
  );
  return section;
}

export async function createExercise(sectionId: string, data: Exercise) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  const exercise = await databases.createDocument<ExerciseDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_EXERCISES_COLLECTION_ID,
    "unique()",
    {
      section: sectionId,
      ...data,
    },
    getFullAccessCurrentUser(user)
  );
  return exercise;
}

export async function updateExercise(exerciseId: string, data: Exercise) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  const exercise = await databases.updateDocument<ExerciseDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_EXERCISES_COLLECTION_ID,
    exerciseId,
    data,
    getFullAccessCurrentUser(user)
  );
  return exercise;
}

export async function updateSection(sectionId: string, data: Section) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  const section = await databases.updateDocument<SectionDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_SECTIONS_COLLECTION_ID,
    sectionId,
    data,
    getFullAccessCurrentUser(user)
  );
  return section;
}

export async function deleteExercise(exerciseId: string) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_EXERCISES_COLLECTION_ID,
    exerciseId
  );
}

export async function deleteSection(sectionId: string) {
  const user = await account.get();
  if (!user) {
    throw new Error("User not found");
  }
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_SECTIONS_COLLECTION_ID,
    sectionId
  );
}
