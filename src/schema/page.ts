import { z } from "zod";

export const zodPageSchema = z.object({
  clientId: z.string().max(100),
});

export type PageZodSchemaType = z.infer<typeof zodPageSchema>;
