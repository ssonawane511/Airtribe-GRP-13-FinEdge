import express from "express";
import transactionsValidator from "./transactions.validator.js";
import transactionsController from "./transactions.controller.js";
import authenticate from "../../shared/middleware/authenticate.middleware.js";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

router.get("/", authenticate, validate(transactionsValidator.getAllTransactionsSchema), transactionsController.getAllTransactions);
router.post(
  "/",
  authenticate,
  validate(transactionsValidator.createTransactionSchema),
  transactionsController.createTransaction,
);
router.get("/summary", authenticate, validate(transactionsValidator.summarySchema), transactionsController.getTransactionSummary);
router.get("/trend", authenticate, validate(transactionsValidator.trendSchema), transactionsController.getTransactionTrend);
router.put(
  "/:id",
  authenticate,
  validate(transactionsValidator.updateTransactionSchema),
  transactionsController.updateTransaction,
);
router.get(
  "/:id",
  authenticate,
  validate(transactionsValidator.getTransactionByIdSchema),
  transactionsController.getTransactionById,
);
router.delete("/:id", authenticate, transactionsController.deleteTransaction);

export default router;
