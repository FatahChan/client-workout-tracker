import { db } from ".";
import {
  ClientDocType,
  CommonDocumentPropertiesKeys,
  ExerciseDocType,
  SectionDocType,
} from "./schema";

export async function createClient(
  data: Omit<ClientDocType, CommonDocumentPropertiesKeys>
) {
  return await db.clients.insert({
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function createPage(clientId: string) {
  return await db.pages.insert({
    id: crypto.randomUUID(),
    clientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function createSection(
  pageId: string,
  data: Omit<SectionDocType, CommonDocumentPropertiesKeys>
) {
  return await db.sections.insert({
    ...data,
    id: crypto.randomUUID(),
    pageId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function createExercise(
  sectionId: string,
  data: Omit<ExerciseDocType, CommonDocumentPropertiesKeys>
) {
  return await db.exercises.insert({
    ...data,
    id: crypto.randomUUID(),
    sectionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateExercise(
  exerciseId: string,
  data: Omit<ExerciseDocType, CommonDocumentPropertiesKeys | "sectionId">
) {
  return await db.exercises.upsert({
    ...data,
    id: exerciseId,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateSection(
  sectionId: string,
  data: Omit<SectionDocType, CommonDocumentPropertiesKeys | "pageId">
) {
  return await db.sections.upsert({
    ...data,
    id: sectionId,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateClient(
  clientId: string,
  data: Omit<ClientDocType, CommonDocumentPropertiesKeys>
) {
  return await db.clients.upsert({
    ...data,
    id: clientId,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteExercise(exerciseId: string) {
  return await db.exercises.findOne(exerciseId).remove();
}

export async function deleteSection(sectionId: string) {
  return await db.sections.findOne(sectionId).remove();
}

export async function deletePage(pageId: string) {
  return await db.pages.findOne(pageId).remove();
}

export async function deleteClient(clientId: string) {
  return await db.clients.findOne(clientId).remove();
}
