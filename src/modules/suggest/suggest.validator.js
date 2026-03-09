import { z } from "zod";

export const getSuggestSchema = z.object({
  query: z.object({
    ask: z.string(),
  }),
});

export default { getSuggestSchema };
