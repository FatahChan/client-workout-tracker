import {
  DeepReadonlyObject,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb";

export type IsTypeSatisfies<T, U> = T extends U ? true : false;

export type DocTypeFromJSONSchema<
  T extends DeepReadonlyObject<RxJsonSchema<never>>,
> = ExtractDocumentTypeFromTypedRxJsonSchema<
  ReturnType<typeof toTypedRxJsonSchema<T>>
>;

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

export const jsonSchemaTemplate = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: commonDocumentProperties,
  required: ["id", "createdAt", "updatedAt"],
} as const;
