import { AppwriteException, Query } from "appwrite";
import {
  databases,
  APPWRITE_DATABASE_ID,
  APPWRITE_CLIENTS_COLLECTION_ID,
  APPWRITE_PAGES_COLLECTION_ID,
  APPWRITE_EXERCISES_COLLECTION_ID,
  APPWRITE_SECTIONS_COLLECTION_ID,
} from ".";
import {
  ClientDocument,
  ExerciseDocument,
  PageDocument,
  SectionDocument,
} from "./types";

export async function listClients(query?: string[]) {
  return await databases.listDocuments<ClientDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_CLIENTS_COLLECTION_ID,
    query
  );
}
export async function listAllClients(query?: string[]) {
  return await listClients(query);
}

export async function listPages(clientId: string) {
  return await databases.listDocuments<PageDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    [Query.equal("client", clientId)]
  );
}

export async function listAllPages(query?: string[]) {
  return await databases.listDocuments<PageDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    query
  );
}

export async function listAllSections(query?: string[]) {
  return await databases.listDocuments<SectionDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_SECTIONS_COLLECTION_ID,
    query
  );
}

export async function listSections(pageId: string) {
  return await databases.listDocuments<SectionDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_SECTIONS_COLLECTION_ID,
    [Query.equal("page", pageId)]
  );
}

export async function listExercises(sectionId: string) {
  return await databases.listDocuments<ExerciseDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_EXERCISES_COLLECTION_ID,
    [Query.equal("section", sectionId)]
  );
}

export async function listAllExercises(query?: string[]) {
  return await databases.listDocuments<ExerciseDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_EXERCISES_COLLECTION_ID,
    query
  );
}

export async function getClient(clientId: string) {
  try {
    const client = await databases.getDocument<ClientDocument>(
      APPWRITE_DATABASE_ID,
      APPWRITE_CLIENTS_COLLECTION_ID,
      clientId
    );
    return client;
  } catch (error) {
    if (
      error instanceof AppwriteException &&
      error.type === "document_not_found"
    ) {
      return null;
    }
    throw error;
  }
}

export async function getPage(pageId: string) {
  try {
    const page = await databases.getDocument<PageDocument>(
      APPWRITE_DATABASE_ID,
      APPWRITE_PAGES_COLLECTION_ID,
      pageId
    );
    return page;
  } catch (error) {
    if (
      error instanceof AppwriteException &&
      error.type === "document_not_found"
    ) {
      return null;
    }
    throw error;
  }
}

export async function getSection(sectionId: string) {
  try {
    const section = await databases.getDocument<SectionDocument>(
      APPWRITE_DATABASE_ID,
      APPWRITE_SECTIONS_COLLECTION_ID,
      sectionId
    );
    return section;
  } catch (error) {
    if (
      error instanceof AppwriteException &&
      error.type === "document_not_found"
    ) {
      return null;
    }
    throw error;
  }
}

export async function getExercise(exerciseId: string) {
  try {
    const exercise = await databases.getDocument<ExerciseDocument>(
      APPWRITE_DATABASE_ID,
      APPWRITE_EXERCISES_COLLECTION_ID,
      exerciseId
    );
    return exercise;
  } catch (error) {
    if (
      error instanceof AppwriteException &&
      error.type === "document_not_found"
    ) {
      return null;
    }
    throw error;
  }
}
