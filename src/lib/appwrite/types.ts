import { type Models } from "appwrite";
import { z } from "zod";

export type Document<T> = Models.Document & T;
export type User = Models.User<Models.Preferences>;
export type DocumentList<T extends Document<unknown>> = Models.DocumentList<T>;

export const ExerciseSchema = z.object({
  name: z.string(),
  sets: z.coerce.number(),
  reps: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
});

export const SectionSchema = z.object({
  name: z.string(),
});

export const ClientSchema = z.object({
  name: z.string(),
  age: z.coerce.number().optional(),
  bodyType: z.string().optional(),
  goal: z.string().optional(),
});

export const PageSchema = z.object({});

export type Client = z.infer<typeof ClientSchema>;
export type ClientDocument = Document<Client & { pages: PageDocument[] }>;

export type Page = z.infer<typeof PageSchema>;
export type PageDocument = Document<Page & { sections: SectionDocument[] }>;

export type Section = z.infer<typeof SectionSchema>;
export type SectionDocument = Document<
  Section & { exercises: ExerciseDocument[] }
>;

export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseDocument = Document<Exercise>;
