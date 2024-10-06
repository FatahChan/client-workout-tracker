import { zodClientSchema } from "@/schema/client";
import { z } from "zod";
import {
  DocTypeFromJSONSchema,
  IsTypeSatisfies,
  jsonSchemaTemplate,
} from "./utils";

type ClientZodSchemaType = z.infer<typeof zodClientSchema>;
export const clientJSONSchema = {
  ...jsonSchemaTemplate,
  properties: {
    ...jsonSchemaTemplate.properties,
    name: {
      type: "string",
      maxLength: 32,
    },
    age: { type: "integer", minimum: 0, maximum: 100 },
    bodyType: { type: "string", maxLength: 32 },
    goal: { type: "string", maxLength: 32 },
  },
  required: [...jsonSchemaTemplate.required, "name"],
} as const;

export type ClientDocType = DocTypeFromJSONSchema<typeof clientJSONSchema>;

/**
 * This value will always be true
 *
 * This line will throw a lint error if the types are incompatible
 */
export const _isClientDocTypeSatisfiesZod: IsTypeSatisfies<
  ClientDocType,
  ClientZodSchemaType
> = true;
