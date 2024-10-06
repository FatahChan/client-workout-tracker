import {
  DeepReadonlyObject,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb";
import { commonDocumentProperties } from ".";

export type IsTypeSatisfies<T, U> = T extends U ? true : false;

export type DocTypeFromJSONSchema<
  T extends DeepReadonlyObject<RxJsonSchema<never>>,
> = ExtractDocumentTypeFromTypedRxJsonSchema<
  ReturnType<typeof toTypedRxJsonSchema<T>>
>;

export const jsonSchemaTemplate = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: commonDocumentProperties,
  required: ["id", "createdAt", "updatedAt"],
} as const;
