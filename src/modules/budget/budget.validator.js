import { z } from "zod";

const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

export const getBudgetSchema = z.object({
  query: z.object({
    month: z
      .string()
      .regex(monthRegex, "Month must be YYYY-MM format")
      .optional(),
  }),
});

export const putBudgetSchema = z.object({
  body: z.object({
    month: z
      .string()
      .regex(monthRegex, "Month must be YYYY-MM format")
      .optional(),
    monthlyGoal: z.number().min(0, "Monthly goal must be >= 0"),
    savingsTarget: z.number().min(0, "Savings target must be >= 0"),
  }),
});

export default {
  getBudgetSchema,
  putBudgetSchema,
};
