import mongoose from 'mongoose';
import Transaction from './transactions.model.js';
import { NotFoundError } from '../../shared/errors/errors.js';
import Cache from '../../shared/utils/cache.js';

const createTransaction = async ({ userId, type, category, amount, date, notes }) => {
    const cacheKey = `transaction_summary_${userId}`;
    Cache.invalidate(cacheKey);
    const transaction = await Transaction.create({ user: userId, type, category, amount, date: new Date(date), notes });
    return transaction;
}

const updateTransaction = async ({ id, userId, type, category, amount, date, notes }) => {
    const cacheKey = `transaction_summary_${userId}`;
    Cache.invalidate(cacheKey);
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.user.toString() !== userId.toString()) {
        throw new NotFoundError('Transaction not found');
    }
    transaction.type = type;
    transaction.category = category;
    transaction.amount = amount;
    transaction.date = new Date(date);
    transaction.notes = notes;
    await transaction.save();
    return transaction;
}

const getAllTransactions = async ({ userId, page, limit }) => {
    page = Number(page);
    limit = Math.min(Number(limit), 10);

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        Transaction.find({ user: userId })
            .sort({ date: -1 }) // newest first
            .skip(skip)
            .limit(limit),
        Transaction.countDocuments({ user: userId })
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

const getTransactionSummary = async ({ userId }) => {
    const cacheKey = `transaction_summary_${userId}`;
    const cachedSummary = Cache.get(cacheKey);
    if (cachedSummary) {
        return cachedSummary;
    }
    const summary = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $count: {} } } }
    ]);
    Cache.set(cacheKey, summary, 60 * 1000);
    return summary;
}

export default {
    createTransaction,
    updateTransaction,
    getTransactionById,
    deleteTransaction,
    getAllTransactions,
    getTransactionSummary
}