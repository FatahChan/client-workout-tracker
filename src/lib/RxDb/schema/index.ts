import { RxCollection } from "rxdb";
import { ClientDocType, clientJSONSchema } from "./client";
import { PageDocType, pageJSONSchema } from "./page";
import { SectionDocType, sectionJSONSchema } from "./section";
import { ExerciseDocType, exerciseJSONSchema } from "./exercise";
import {
  commonDocumentProperties,
  CommonDocumentPropertiesKeys,
} from "./utils";

export type DatabaseCollections = {
  clients: RxCollection<ClientDocType>;
  pages: RxCollection<PageDocType>;
  sections: RxCollection<SectionDocType>;
  exercises: RxCollection<ExerciseDocType>;
};

export type { ClientDocType, PageDocType, SectionDocType, ExerciseDocType };

export const schemas = {
  client: clientJSONSchema,
  page: pageJSONSchema,
  section: sectionJSONSchema,
  exercise: exerciseJSONSchema,
} as const;

export { commonDocumentProperties };
export type { CommonDocumentPropertiesKeys };
