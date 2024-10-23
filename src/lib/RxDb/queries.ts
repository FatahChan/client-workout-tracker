import { getDataBaseInstance } from ".";

const db = await getDataBaseInstance();

export function listClients() {
  return db.clients.find().exec();
}

export function listPages(clientId: string) {
  return db.pages
    .find()
    .where({
      clientId: clientId,
    })
    .exec();
}

export function listSections(pageId: string) {
  return db.sections.find().where({ pageId: pageId }).exec();
}

export function listExercises(sectionId: string) {
  return db.exercises.find().where({ sectionId: sectionId }).exec();
}

export function getClient(clientId: string) {
  return db.clients.findOne(clientId).exec();
}

export function getPage(pageId: string) {
  return db.pages.findOne(pageId).exec();
}

export function getSection(sectionId: string) {
  return db.sections.findOne(sectionId).exec();
}
export function getExercise(exerciseId: string) {
  return db.exercises.findOne(exerciseId).exec();
}
