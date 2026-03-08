import transactionService from "./transactions.services.js";
import { successResponse } from "../../shared/utils/response.js";

const createTransaction = async (req, res) => {
  const { type, category, amount, date, notes } = req.body;
  const transaction = await transactionService.createTransaction({
    userId: req.user.id,
    type,
    category,
    amount,
    date,
    notes,
  });
  successResponse(res, transaction, "Transaction created successfully", 201);
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, notes } = req.body;
  const transaction = await transactionService.updateTransaction({
    id,
    userId: req.user.id,
    type,
    category,
    amount,
    date,
    notes,
  });
  successResponse(res, transaction, "Transaction updated successfully", 200);
};

const getAllTransactions = async (req, res) => {
  const { page, limit, category, type, startDate, endDate } = req.query;
  const transactions = await transactionService.getAllTransactions({
    userId: req.user.id,
    page,
    limit,
    category,
    type,
    startDate,
    endDate,
  });
  successResponse(res, transactions, "Transactions fetched successfully", 200);
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransactionById(id);
  successResponse(res, transaction, "Transaction fetched successfully", 200);
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  await transactionService.deleteTransaction(id);
  successResponse(res, null, "Transaction deleted successfully", 200);
};

const getTransactionSummary = async (req, res) => {
  const defaultStartDate = new Date(new Date().setDate(new Date().getDate() - 30));
  const defaultEndDate = new Date();
  const { startDate = defaultStartDate, endDate = defaultEndDate } = req.query;
  const summary = await transactionService.getTransactionSummary({
    userId: req.user.id,
    startDate,
    endDate,
  });
  successResponse(
    res,
    summary,
    "Transaction summary fetched successfully",
    200,
  );
};

const getTransactionTrend = async (req, res) => {
  const defaultStartDate = new Date(new Date().setDate(new Date().getDate() - 30));
  const defaultEndDate = new Date();
  const { startDate = defaultStartDate, endDate = defaultEndDate } = req.query;
  const trend = await transactionService.getTransactionTrend({
    userId: req.user.id,
    startDate: startDate,
    endDate: endDate,
  });
  successResponse(res, trend, "Transaction trend fetched successfully", 200);
};


export default {
  createTransaction,
  updateTransaction,
  getTransactionById,
  deleteTransaction,
  getAllTransactions,
  getTransactionSummary,
  getTransactionTrend,
};
