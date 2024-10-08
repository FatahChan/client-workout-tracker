import { z } from "zod";

export const zodExerciseSchema = z.object({
  sectionId: z.string().max(100),
  name: z.string().max(32),
  sets: z.coerce.number().int().min(0).max(100),
  reps: z.coerce.number().int().min(0).max(100).max(100).optional(),
  weight: z.coerce.number().int().min(0).max(100).max(100).optional(),
});

export type ExerciseZodSchemaType = z.infer<typeof zodExerciseSchema>;
