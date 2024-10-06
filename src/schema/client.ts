import { z } from "zod";

export const zodClientSchema = z.object({
  name: z.string().max(32),
  age: z.coerce.number().max(100).optional(),
  bodyType: z.string().max(32).optional(),
  goal: z.string().max(32).optional(),
});
