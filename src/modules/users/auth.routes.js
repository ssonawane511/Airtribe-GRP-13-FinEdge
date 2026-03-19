import express from "express";
import passport from "passport";

import userController from "./users.controller.js";
import usersValidator from "./users.validator.js";
import validate from "../../shared/middleware/validate.middleware.js";
import { authRateLimiter } from "../../shared/middleware/ratelimit.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  authRateLimiter,
  validate(usersValidator.createUserSchema),
  userController.signup,
);

router.post(
  "/login",
  authRateLimiter,
  validate(usersValidator.loginUserSchema),
  userController.login,
);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  authRateLimiter,
  userController.logout,
);

export default router;
