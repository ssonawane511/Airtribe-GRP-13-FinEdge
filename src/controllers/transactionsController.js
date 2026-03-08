const mongoose = require('mongoose');
const transactionModel = require('../models/transactionModel');
const {
    BadRequestError,
    NotFoundError,
} = require('../utils/errors');

const VALID_TYPES = new Set(['income', 'expense']);

const validateDate = (value) => {
    const dateValue = value ? new Date(value) : new Date();
    if (Number.isNaN(dateValue.getTime())) {
        throw new BadRequestError('Invalid date value');
    }
    return dateValue;
};

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid transaction id');
    }
};

const toTransactionResponse = (transaction) => ({
    id: transaction._id,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
});

const createTransaction = async (userId, payload) => {
    const type = payload?.type?.trim?.().toLowerCase();
    const category = payload?.category?.trim?.();
    const amount = Number(payload?.amount);

    if (!VALID_TYPES.has(type)) {
        throw new BadRequestError('type must be income or expense');
    }
    if (!category) {
        throw new BadRequestError('category is required');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new BadRequestError('amount must be a positive number');
    }

    const transaction = await transactionModel.create({
        user: userId,
        type,
        category,
        amount,
        date: validateDate(payload?.date),
    });

    return toTransactionResponse(transaction);
};

const getTransactions = async (userId, filters) => {
    const query = { user: userId };
    const { category, date, startDate, endDate } = filters || {};

    if (category) {
        query.category = String(category).trim();
    }

    if (date) {
        const start = validateDate(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);
        query.date = { $gte: start, $lt: end };
    } else if (startDate || endDate) {
        query.date = {};
        if (startDate) {
            query.date.$gte = validateDate(startDate);
        }
        if (endDate) {
            query.date.$lte = validateDate(endDate);
        }
    }

    const transactions = await transactionModel
        .find(query)
        .sort({ date: -1, createdAt: -1 });

    return { transactions: transactions.map(toTransactionResponse) };
};

const getTransactionById = async (userId, transactionId) => {
    validateId(transactionId);

    const transaction = await transactionModel.findOne({ _id: transactionId, user: userId });
    if (!transaction) {
        throw new NotFoundError('Transaction not found');
    }

    return toTransactionResponse(transaction);
};

const updateTransaction = async (userId, transactionId, payload) => {
    validateId(transactionId);

    const updates = {};
    if (payload?.type !== undefined) {
        const type = String(payload.type).trim().toLowerCase();
        if (!VALID_TYPES.has(type)) {
            throw new BadRequestError('type must be income or expense');
        }
        updates.type = type;
    }
    if (payload?.category !== undefined) {
        const category = String(payload.category).trim();
        if (!category) {
            throw new BadRequestError('category cannot be empty');
        }
        updates.category = category;
    }
    if (payload?.amount !== undefined) {
        const amount = Number(payload.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new BadRequestError('amount must be a positive number');
        }
        updates.amount = amount;
    }
    if (payload?.date !== undefined) {
        updates.date = validateDate(payload.date);
    }

    if (Object.keys(updates).length === 0) {
        throw new BadRequestError('No valid fields provided for update');
    }

    const updatedTransaction = await transactionModel.findOneAndUpdate(
        { _id: transactionId, user: userId },
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
        throw new NotFoundError('Transaction not found');
    }

    return toTransactionResponse(updatedTransaction);
};

const deleteTransaction = async (userId, transactionId) => {
    validateId(transactionId);

    const deletedTransaction = await transactionModel.findOneAndDelete({
        _id: transactionId,
        user: userId,
    });

    if (!deletedTransaction) {
        throw new NotFoundError('Transaction not found');
    }

    return {
        message: 'Transaction deleted',
        id: deletedTransaction._id,
    };
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
