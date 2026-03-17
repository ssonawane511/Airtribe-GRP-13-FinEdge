import express from "express";
import budgetValidator from "./budget.validator.js";
import budgetController from "./budget.controller.js";
import passport from "passport";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(budgetValidator.getBudgetSchema),
  budgetController.getBudget,
);
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(budgetValidator.putBudgetSchema),
  budgetController.putBudget,
);

export default router;
