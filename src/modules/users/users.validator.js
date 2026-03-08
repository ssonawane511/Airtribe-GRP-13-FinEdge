import { z } from "zod"

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6)
    })
})

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
})

export default {
    createUserSchema,
    loginUserSchema
}