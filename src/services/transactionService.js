const mongoose = require('mongoose');
const transactionModel = require('../models/transactionModel');
const { BadRequestError } = require('../utils/errors');

const getIncomeExpenseTotalsForRange = async (userId, startDate, endDate) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestError('Invalid user id');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const totals = await transactionModel.aggregate([
        {
            $match: {
                user: userObjectId,
                date: { $gte: startDate, $lt: endDate },
            },
        },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
            },
        },
    ]);

    let income = 0;
    let expense = 0;

    totals.forEach((row) => {
        if (row._id === 'income') {
            income = row.total;
        }
        if (row._id === 'expense') {
            expense = row.total;
        }
    });

    return { income, expense };
};

module.exports = {
    getIncomeExpenseTotalsForRange,
};
