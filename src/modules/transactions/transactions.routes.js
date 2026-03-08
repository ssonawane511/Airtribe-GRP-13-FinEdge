import express from "express";
import transactionsValidator from "./transactions.validator.js";
import transactionsController from "./transactions.controller.js";
import authenticate from "../../shared/middleware/authenticate.middleware.js";
import validate from "../../shared/middleware/validate.middleware.js";
const router = express.Router();

router
  .use("/v1/transactions", router)
  .get("/", authenticate, validate(transactionsValidator.getAllTransactionsSchema), transactionsController.getAllTransactions)
  .post(
    "/",
    authenticate,
    validate(transactionsValidator.createTransactionSchema),
    transactionsController.createTransaction,
  )
  .get("/summary", authenticate, validate(transactionsValidator.summarySchema), transactionsController.getTransactionSummary)
  .get("/trend", authenticate, validate(transactionsValidator.trendSchema), transactionsController.getTransactionTrend  )
  .put(
    "/:id",
    authenticate,
    validate(transactionsValidator.updateTransactionSchema),
    transactionsController.updateTransaction,
  )
  .get(
    "/:id",
    authenticate,
    validate(transactionsValidator.getTransactionByIdSchema),
    transactionsController.getTransactionById,
  )
  .delete("/:id", authenticate, transactionsController.deleteTransaction)


export default router;
