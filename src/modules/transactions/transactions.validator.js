import { z } from 'zod';

export const createTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['income', 'expense']),
        amount: z.number(),
        date: z.iso.datetime().transform(str => new Date(str)),
        notes: z.string().optional(),
        title: z.string(),
    })
})

const updateTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['income', 'expense']),
        amount: z.number(),
        date: z.iso.datetime().transform(str => new Date(str)),
        notes: z.string().optional(),
        title: z.string().optional(),
    })
})

const getTransactionByIdSchema = z.object({
    params: z.object({
        id: z.string()
    })
})

const getAllTransactionsSchema = z.object({
    query: z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        date: z.iso.datetime().transform(str => new Date(str)),
        startDate: z.iso.datetime().transform(str => new Date(str)),
        endDate: z.iso.datetime().transform(str => new Date(str)),
    })
})

const summarySchema = z.object({
    query: z.object({
        startDate: z.iso.datetime().transform(str => new Date(str)).optional(),
        endDate: z.iso.datetime().transform(str => new Date(str)).optional()    
    })
})

const trendSchema = z.object({
    query: z.object({
        startDate: z.iso.datetime().transform(str => new Date(str)).optional(),
        endDate: z.iso.datetime().transform(str => new Date(str)).optional()
    })
})

export default {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionByIdSchema,
    getAllTransactionsSchema,
    summarySchema,
    trendSchema
}