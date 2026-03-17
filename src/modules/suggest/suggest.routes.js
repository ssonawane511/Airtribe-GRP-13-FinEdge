import express from "express";
import suggestController from "./suggest.controller.js";
import passport from "passport";
import validate from "../../shared/middleware/validate.middleware.js";
import suggestValidator from "./suggest.validator.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(suggestValidator.getSuggestSchema),
  suggestController.getSuggest,
);

export default router;
