import { type Models } from "appwrite";

export type Document<T> = Models.Document & T;
export type User = Models.User<Models.Preferences>;
export type DocumentList<T extends Document<unknown>> = Models.DocumentList<T>;
export type ClientDocument = Document<{
  name: string;
  age: number;
  bodyType: string;
  goal: string;
  pages: PageDocument[];
}>;

export type PageDocument = Document<{
  sections: SectionDocument[];
}>;

export type SectionDocument = Document<{
  name: string;
  exercises: ExerciseDocument[];
}>;

export type ExerciseDocument = Document<{
  name: string;
  sets: number;
  reps?: number;
  weight?: number;
}>;
