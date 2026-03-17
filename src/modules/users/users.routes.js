import express from "express";
import userController from "./users.controller.js";
import usersValidator from "./users.validator.js";
import validate from "../../shared/middleware/validate.middleware.js";
import passport from "passport";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getUser,
);

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/signup",
  validate(usersValidator.createUserSchema),
  userController.signup,
);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticate user and issue tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validate(usersValidator.loginUserSchema),
  userController.login,
);

/**
 * @swagger
 * /api/v1/users/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreferencesRequest'
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/preferences",
  passport.authenticate("jwt", { session: false }),
  validate(usersValidator.updateUserPreferencesSchema),
  userController.updateUserPreferences,
);

/**
 * @swagger
 * /api/v1/users/auth/google:
 *   get:
 *     summary: Initiate Google OAuth flow
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent
 */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @swagger
 * /api/v1/users/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback endpoint
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google authentication successful
 *       302:
 *         description: Redirect when OAuth fails
 */
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  userController.googleCallback,
);

export default router;
