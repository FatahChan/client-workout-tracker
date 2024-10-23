import { zodExerciseSchema } from "@/schema/exercise";
import { z } from "zod";
import {
  DocTypeFromJSONSchema,
  IsTypeSatisfies,
  jsonSchemaTemplate,
} from "./utils";

type ExerciseZodSchemaType = z.infer<typeof zodExerciseSchema>;

export const exerciseJSONSchema = {
  ...jsonSchemaTemplate,
  properties: {
    ...jsonSchemaTemplate.properties,
    sectionId: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
      maxLength: 32,
    },
    sets: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    reps: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    weight: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: [...jsonSchemaTemplate.required, "sectionId", "name", "sets"],
} as const;

export type ExerciseDocType = DocTypeFromJSONSchema<typeof exerciseJSONSchema>;

/**
 * This value will always be true
 *
 * This line will throw a lint error if the types are incompatible
 */
export const _isExerciseDocTypeSatisfiesZod: IsTypeSatisfies<
  ExerciseDocType,
  ExerciseZodSchemaType
> = true;
