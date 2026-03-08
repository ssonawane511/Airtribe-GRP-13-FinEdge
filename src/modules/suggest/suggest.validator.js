import { z } from "zod";

export const getSuggestSchema = z.object({
    body: z.object({
        ask: z.string()
    })
})

export default { getSuggestSchema };