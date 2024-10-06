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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function createPage(clientId: string) {
  return await db.pages.insert({
    id: crypto.randomUUID(),
    clientId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateExercise(
  exerciseId: string,
  data: Omit<ExerciseDocType, CommonDocumentPropertiesKeys>
) {
  return await db.exercises.upsert({
    ...data,
    id: exerciseId,
    updatedAt: Date.now(),
  });
}

export async function updateSection(
  sectionId: string,
  data: Omit<SectionDocType, CommonDocumentPropertiesKeys>
) {
  return await db.sections.upsert({
    ...data,
    id: sectionId,
    updatedAt: Date.now(),
  });
}

export async function updateClient(
  clientId: string,
  data: Omit<ClientDocType, CommonDocumentPropertiesKeys>
) {
  return await db.clients.upsert({
    ...data,
    id: clientId,
    updatedAt: Date.now(),
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
