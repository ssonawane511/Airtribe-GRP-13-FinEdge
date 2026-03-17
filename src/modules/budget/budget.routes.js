import express from "express";
import budgetValidator from "./budget.validator.js";
import budgetController from "./budget.controller.js";
import passport from "passport";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/budget:
 *   get:
 *     summary: Get budget for a month
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: 2026-03
 *     responses:
 *       200:
 *         description: Budget fetched successfully
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(budgetValidator.getBudgetSchema),
  budgetController.getBudget,
);

/**
 * @swagger
 * /api/v1/budget:
 *   put:
 *     summary: Create or update monthly budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetRequest'
 *     responses:
 *       200:
 *         description: Budget updated successfully
 */
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(budgetValidator.putBudgetSchema),
  budgetController.putBudget,
);

export default router;
