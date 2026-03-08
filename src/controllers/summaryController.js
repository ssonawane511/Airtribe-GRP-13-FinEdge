const { BadRequestError } = require('../utils/errors');
const { getIncomeExpenseTotalsForRange } = require('../services/transactionService');

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const normalizeMonth = (month) => {
    const value = month;
    if (!MONTH_REGEX.test(value)) {
        throw new BadRequestError('month must be in YYYY-MM format');
    }
    return value;
};

const getMonthStart = (month) => new Date(`${month}-01T00:00:00.000Z`);

const toMonthString = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

const getSummary = async (userId, month) => {
    const normalizedMonth = normalizeMonth(month);
    const start = getMonthStart(normalizedMonth);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    const { income, expense } = await getIncomeExpenseTotalsForRange(userId, start, end);

    const balance = income - expense;

    return {
        month: normalizedMonth,
        totals: {
            totalIncome: income,
            totalExpense: expense,
            balance,
            income,
            expense,
            netSavings: balance,
        }
    };
};

const getMonthlyTrends = async (userId) => {
    const monthsCount = 6;
    const endDate = new Date();
    endDate.setUTCDate(1);
    endDate.setUTCHours(0, 0, 0, 0);
    const endMonth = toMonthString(endDate);

    const trends = [];

    for (let i = monthsCount - 1; i >= 0; i -= 1) {
        const monthDate = new Date(endDate);
        monthDate.setUTCMonth(monthDate.getUTCMonth() - i);

        const month = toMonthString(monthDate);
        const start = getMonthStart(month);
        const end = new Date(start);
        end.setUTCMonth(end.getUTCMonth() + 1);

        const { income, expense } = await getIncomeExpenseTotalsForRange(userId, start, end);
        trends.push({
            month,
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
        });
    }

    return {
        months: monthsCount,
        endMonth,
        trends,
    };
};

module.exports = {
    getSummary,
    getMonthlyTrends,
};
