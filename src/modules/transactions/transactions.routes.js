import express from "express";
import transactionsValidator from "./transactions.validator.js";
import transactionsController from "./transactions.controller.js";
import passport from "passport";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get paginated transactions with optional filters
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.getAllTransactionsSchema),
  transactionsController.getAllTransactions,
);

/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionRequest'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.createTransactionSchema),
  transactionsController.createTransaction,
);

/**
 * @swagger
 * /api/v1/transactions/summary:
 *   get:
 *     summary: Get transaction summary for date range
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Transaction summary fetched successfully
 */
router.get(
  "/summary",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.summarySchema),
  transactionsController.getTransactionSummary,
);

/**
 * @swagger
 * /api/v1/transactions/trend:
 *   get:
 *     summary: Get transaction trend for date range
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Transaction trend fetched successfully
 */
router.get(
  "/trend",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.trendSchema),
  transactionsController.getTransactionTrend,
);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Update transaction by id
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionRequest'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 */
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.updateTransactionSchema),
  transactionsController.updateTransaction,
);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get transaction by id
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
 */
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.getTransactionByIdSchema),
  transactionsController.getTransactionById,
);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   delete:
 *     summary: Delete transaction by id
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  transactionsController.deleteTransaction,
);

export default router;
