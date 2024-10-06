import { RxCollection } from "rxdb";
import { ClientDocType, clientJSONSchema } from "./client";
import { PageDocType, pageJSONSchema } from "./page";
import { SectionDocType, sectionJSONSchema } from "./section";
import { ExerciseDocType, exerciseJSONSchema } from "./exercise";
export const commonDocumentProperties = {
  id: {
    type: "string",
    maxLength: 100,
  },
  createdAt: {
    type: "number",
  },
  updatedAt: {
    type: "number",
  },
} as const;

export type CommonDocumentPropertiesKeys =
  keyof typeof commonDocumentProperties;

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
