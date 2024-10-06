import { z } from "zod";

export const zodSectionSchema = z.object({
  pageId: z.string().max(100),
  name: z.string().max(32),
});
