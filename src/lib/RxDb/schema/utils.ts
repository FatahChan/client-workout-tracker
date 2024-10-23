import { Models } from "appwrite";
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
    type: "string",
    format: "date-time",
  },
  updatedAt: {
    type: "string",
    format: "date-time",
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

export function convertAppwriteDocumentToRxDBDocumentData<
  T extends Models.Document,
  R extends {
    id: string;
    createdAt: string;
    updatedAt: string;
    _deleted: boolean;
  },
>(doc?: T | null) {
  if (!doc) {
    return doc;
  }
  const {
    $id,
    $createdAt,
    $updatedAt,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    $collectionId,
    $databaseId,
    $permissions,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...reset
  } = doc;

  return {
    id: $id,
    createdAt: $createdAt,
    updatedAt: $updatedAt,
    _deleted: false,
    ...reset,
  } as unknown as R;
}
