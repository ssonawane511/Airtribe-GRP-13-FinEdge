import { z } from 'zod';

export const createTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['income', 'expense']),
        category: z.string(),
        amount: z.number(),
        date: z.iso.datetime().transform(str => new Date(str)),
        notes: z.string().optional()
    })
})

const updateTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['income', 'expense']),
        category: z.string(),
        amount: z.number(),
        date: z.iso.datetime().transform(str => new Date(str)),
        notes: z.string().optional()
    })
})

const getTransactionByIdSchema = z.object({
    params: z.object({
        id: z.string()
    })
})

export default {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionByIdSchema
}