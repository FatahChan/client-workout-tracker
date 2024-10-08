import { zodSectionSchema } from "@/schema/section";
import { z } from "zod";
import {
  DocTypeFromJSONSchema,
  IsTypeSatisfies,
  jsonSchemaTemplate,
} from "./utils";

type SectionZodSchemaType = z.infer<typeof zodSectionSchema>;

export const sectionJSONSchema = {
  ...jsonSchemaTemplate,
  properties: {
    ...jsonSchemaTemplate.properties,
    name: {
      type: "string",
      maxLength: 32,
    },
    pageId: {
      type: "string",
      maxLength: 100,
    },
  },
  required: [...jsonSchemaTemplate.required, "pageId", "name"],
} as const;

export type SectionDocType = DocTypeFromJSONSchema<typeof sectionJSONSchema>;

/**
 * This value will always be true
 *
 * This line will throw a lint error if the types are incompatible
 */
export const _isSectionDocTypeSatisfiesZod: IsTypeSatisfies<
  SectionDocType,
  SectionZodSchemaType
> = true;
