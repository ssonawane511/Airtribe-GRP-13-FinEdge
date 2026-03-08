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
        title: z.string(),
    })
})

const getTransactionByIdSchema = z.object({
    params: z.object({
        id: z.string()
    })
})

const getAllTransactionsSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        startDate: z.iso.datetime().transform(str => new Date(str)).optional(),
        endDate: z.iso.datetime().transform(str => new Date(str)).optional(),
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