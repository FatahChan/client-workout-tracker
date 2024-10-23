import { zodPageSchema } from "@/schema/page";
import { z } from "zod";
import {
  DocTypeFromJSONSchema,
  IsTypeSatisfies,
  jsonSchemaTemplate,
} from "./utils";

type PageZodSchemaType = z.infer<typeof zodPageSchema>;

export const pageJSONSchema = {
  ...jsonSchemaTemplate,
  title: "page",
  properties: {
    ...jsonSchemaTemplate.properties,
    clientId: {
      type: "string",
      maxLength: 100,
    },
  },
  required: [...jsonSchemaTemplate.required, "clientId"],
} as const;

export type PageDocType = DocTypeFromJSONSchema<typeof pageJSONSchema>;

/**
 * This value will always be true
 *
 * This line will throw a lint error if the types are incompatible
 */
export const _isPageDocTypeSatisfiesZod: IsTypeSatisfies<
  PageDocType,
  PageZodSchemaType
> = true;
