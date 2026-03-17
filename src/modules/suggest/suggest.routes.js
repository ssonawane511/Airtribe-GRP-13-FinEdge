import express from "express";
import suggestController from "./suggest.controller.js";
import passport from "passport";
import validate from "../../shared/middleware/validate.middleware.js";
import suggestValidator from "./suggest.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/suggest:
 *   get:
 *     summary: Get AI-based financial suggestion
 *     tags: [Suggest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ask
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggest fetched successfully
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(suggestValidator.getSuggestSchema),
  suggestController.getSuggest,
);

export default router;
