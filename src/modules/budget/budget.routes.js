import express from "express";
import budgetValidator from "./budget.validator.js";
import budgetController from "./budget.controller.js";
import authenticate from "../../shared/middleware/authenticate.middleware.js";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  validate(budgetValidator.getBudgetSchema),
  budgetController.getBudget,
);
router.put(
  "/",
  authenticate,
  validate(budgetValidator.putBudgetSchema),
  budgetController.putBudget,
);

export default router;
