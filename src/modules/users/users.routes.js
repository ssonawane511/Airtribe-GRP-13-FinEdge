import express from "express";
import userController from "./users.controller.js";
import usersValidator from "./users.validator.js";
import validate from "../../shared/middleware/validate.middleware.js";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getUser,
);
router.post(
  "/signup",
  validate(usersValidator.createUserSchema),
  userController.signup,
);
router.post(
  "/login",
  validate(usersValidator.loginUserSchema),
  userController.login,
);
router.put(
  "/preferences",
  passport.authenticate("jwt", { session: false }),
  validate(usersValidator.updateUserPreferencesSchema),
  userController.updateUserPreferences,
);

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  userController.googleCallback,
);

export default router;
