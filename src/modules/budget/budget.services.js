import Budget from "./budget.model.js";
import mongoose from "mongoose";

const getMonthString = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const getBudget = async ({ userId, month }) => {
  const monthStr = month || getMonthString();
  const budget = await Budget.findOne({
    user: new mongoose.Types.ObjectId(userId),
    month: monthStr,
  });
  return budget || null;
};

const upsertBudget = async ({ userId, month, monthlyGoal, savingsTarget }) => {
  const monthStr = month || getMonthString();
  const budget = await Budget.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(userId),
      month: monthStr,
    },
    { monthlyGoal, savingsTarget },
    { returnDocument: "after", upsert: true, runValidators: true }
  );
  return budget;
};

export default {
  getBudget,
  upsertBudget,
};
