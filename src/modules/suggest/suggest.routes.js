import express from "express";
import suggestController from "./suggest.controller.js";
import authenticate from "../../shared/middleware/authenticate.middleware.js";
import validate from "../../shared/middleware/validate.middleware.js";
import suggestValidator from "./suggest.validator.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  validate(suggestValidator.getSuggestSchema),
  suggestController.getSuggest,
);

export default router;
