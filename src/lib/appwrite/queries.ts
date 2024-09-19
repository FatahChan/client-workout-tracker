import { Query } from "appwrite";
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

export async function listClients() {
  return await databases.listDocuments<ClientDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_CLIENTS_COLLECTION_ID
  );
}

export async function listPages(clientId: string) {
  return await databases.listDocuments<PageDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    [Query.equal("client", clientId)]
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

export async function getClient(clientId: string) {
  return await databases.getDocument<ClientDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_CLIENTS_COLLECTION_ID,
    clientId
  );
}

export async function getPage(pageId: string) {
  return await databases.getDocument<PageDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    pageId
  );
}

export async function getSection(sectionId: string) {
  return await databases.getDocument<SectionDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_SECTIONS_COLLECTION_ID,
    sectionId
  );
}

export async function getExercise(exerciseId: string) {
  return await databases.getDocument<ExerciseDocument>(
    APPWRITE_DATABASE_ID,
    APPWRITE_EXERCISES_COLLECTION_ID,
    exerciseId
  );
}
