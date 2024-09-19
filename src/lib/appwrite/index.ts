import { Client, Account, Databases } from "appwrite";

const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string;
const APPWRITE_DATABASE_ID = import.meta.env
  .VITE_APPWRITE_DATABASE_ID as string;
const APPWRITE_CLIENTS_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_CLIENTS_COLLECTION_ID as string;
const APPWRITE_PAGES_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_PAGES_COLLECTION_ID as string;
const APPWRITE_SECTIONS_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_SECTIONS_COLLECTION_ID as string;
const APPWRITE_EXERCISES_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_EXERCISES_COLLECTION_ID as string;

if (!APPWRITE_PROJECT_ID) {
  throw new Error("APPWRITE_PROJECT_ID is not set");
}
if (!APPWRITE_DATABASE_ID) {
  throw new Error("APPWRITE_DATABASE_ID is not set");
}
if (!APPWRITE_CLIENTS_COLLECTION_ID) {
  throw new Error("APPWRITE_CLIENTS_COLLECTION_ID is not set");
}
if (!APPWRITE_PAGES_COLLECTION_ID) {
  throw new Error("APPWRITE_PAGES_COLLECTION_ID is not set");
}

const client = new Client().setProject("66e873da00345f972c3a");

const account = new Account(client);

const databases = new Databases(client);

export {
  account,
  databases,
  APPWRITE_DATABASE_ID,
  APPWRITE_CLIENTS_COLLECTION_ID,
  APPWRITE_PAGES_COLLECTION_ID,
  APPWRITE_SECTIONS_COLLECTION_ID,
  APPWRITE_EXERCISES_COLLECTION_ID,
};
