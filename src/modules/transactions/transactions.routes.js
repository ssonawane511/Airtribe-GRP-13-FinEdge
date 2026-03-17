import express from "express";
import transactionsValidator from "./transactions.validator.js";
import transactionsController from "./transactions.controller.js";
import passport from "passport";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.getAllTransactionsSchema),
  transactionsController.getAllTransactions,
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.createTransactionSchema),
  transactionsController.createTransaction,
);
router.get(
  "/summary",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.summarySchema),
  transactionsController.getTransactionSummary,
);
router.get(
  "/trend",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.trendSchema),
  transactionsController.getTransactionTrend,
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.updateTransactionSchema),
  transactionsController.updateTransaction,
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(transactionsValidator.getTransactionByIdSchema),
  transactionsController.getTransactionById,
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  transactionsController.deleteTransaction,
);

export default router;
