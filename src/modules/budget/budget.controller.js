import budgetService from "./budget.services.js";
import { successResponse } from "../../shared/utils/response.js";

const getBudget = async (req, res) => {
  const { month } = req.validatedQuery ?? req.query;
  const monthStr = month || new Date().toISOString().slice(0, 7);
  const budget = await budgetService.getBudget({
    userId: req.user.id,
    month,
  });
  successResponse(
    res,
    budget || { monthlyGoal: 0, savingsTarget: 0, month: monthStr },
    "Budget fetched successfully",
    200,
  );
};

const putBudget = async (req, res) => {
  const { month, monthlyGoal, savingsTarget } = req.body;
  const budget = await budgetService.upsertBudget({
    userId: req.user.id,
    month,
    monthlyGoal,
    savingsTarget,
  });
  successResponse(res, budget, "Budget updated successfully", 200);
};

export default {
  getBudget,
  putBudget,
};
