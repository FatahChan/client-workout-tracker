import { db } from ".";

export async function listClients() {
  return await db.clients.find().exec();
}

export async function listPages(clientId: string) {
  return await db.pages
    .find()
    .where({
      clientId: clientId,
    })
    .exec();
}

export async function listSections(pageId: string) {
  return await db.sections.find().where({ pageId: pageId }).exec();
}

export async function listExercises(sectionId: string) {
  return await db.exercises.find().where({ sectionId: sectionId }).exec();
}

export async function getClient(clientId: string) {
  return await db.clients.findOne(clientId).exec();
}

export async function getPage(pageId: string) {
  return await db.pages.findOne(pageId).exec();
}

export async function getSection(sectionId: string) {
  return await db.sections.findOne(sectionId).exec();
}
export async function getExercise(exerciseId: string) {
  return await db.exercises.findOne(exerciseId).exec();
}
