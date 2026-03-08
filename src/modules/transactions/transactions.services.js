import mongoose from 'mongoose';
import Transaction from './transactions.model.js';
import { NotFoundError } from '../../shared/errors/errors.js';
import Cache from '../../shared/utils/cache.js';
import { analyzeExpense } from '../../shared/services/ai.service.js';

const createTransaction = async ({ userId, type, amount, date, notes, title }) => {
    const cacheKey = `transaction_summary_${userId}`;
    Cache.invalidate(cacheKey);
    const category = await analyzeExpense(title);
    const transaction = await Transaction.create({ user: userId, type, category: category.category, amount, date: new Date(date), notes, title });
    return transaction;
}

const updateTransaction = async ({ id, userId, type, amount, date, notes, title }) => {
    const cacheKey = `transaction_summary_${userId}`;
    Cache.invalidate(cacheKey);
    const category = await analyzeExpense(title);
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.user.toString() !== userId.toString()) {
        throw new NotFoundError('Transaction not found');
    }
    transaction.title = title;
    transaction.type = type;
    transaction.amount = amount;
    transaction.date = new Date(date);
    transaction.notes = notes;
    transaction.category = category.category;
    await transaction.save();
    return transaction;
}

const getAllTransactions = async ({ userId, page, limit, category, type, startDate, endDate }) => {
    page = Number(page);
    limit = Math.min(Number(limit), 10);
    const skip = (page - 1) * limit;
    const filter = { user: userId };

    if (category) {
        filter.category = category;
    }
    if (type) {
        filter.type = type;
    }
    if (startDate) {
        filter.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
        filter.date = { $lte: new Date(endDate) };
    }

    const [transactions, total] = await Promise.all([
        Transaction.find(filter)
            .sort({ date: -1 }) // newest first
            .skip(skip)
            .limit(limit),
        Transaction.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        transactions: transactions,
        pagination: {
            total,
            totalPages,
            page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

const getTransactionById = async (id) => {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
        throw new NotFoundError('Transaction not found');
    }
    return transaction;
}

const deleteTransaction = async (id) => {
    const cacheKey = `transaction_${id}`;
    Cache.invalidate(cacheKey);
    const transaction = await Transaction.findById(id);
    if (!transaction) {
        throw new NotFoundError('Transaction not found');
    }
    await transaction.deleteOne();
}

const getTransactionSummary = async ({ userId, startDate, endDate }) => {
    const cacheKey = `transaction_summary_${userId}`;
    const cachedSummary = Cache.get(cacheKey);
    if (cachedSummary) {
        return cachedSummary;
    }
    let filter = { user: new mongoose.Types.ObjectId(userId) };
    if (startDate) {
        filter.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
        filter.date = { $lte: new Date(endDate) };
    }
    const summary = await Transaction.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
                transactions: { $sum: 1 }
            }
        },
        {
            $addFields: {
                balance: { $subtract: ['$income', '$expense'] }
            }
        },
        {
            $project: {
                _id: 0,
                income: 1,
                expense: 1,
                balance: 1,
                transactions: 1
            }
        }
    ]);
    Cache.set(cacheKey, summary, 60 * 1000);
    return summary;
}

const getTransactionTrend = async ({ userId, startDate, endDate }) => {
    let filter = { user: new mongoose.Types.ObjectId(userId) };
    if (startDate) {
        filter.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
        filter.date = { $lte: new Date(endDate) };
    }
    const trend = await Transaction.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
                transactions: { $sum: 1 }
            }
        },
        {
            $addFields: {
                balance: { $subtract: ['$income', '$expense'] }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                income: 1,
                expense: 1,
                balance: 1,
                transactions: 1
            }
        },
        { $sort: { date: 1 } }
    ]);
    return trend;
}

export default {
    createTransaction,
    updateTransaction,
    getTransactionById,
    deleteTransaction,
    getAllTransactions,
    getTransactionSummary,
    getTransactionTrend
}