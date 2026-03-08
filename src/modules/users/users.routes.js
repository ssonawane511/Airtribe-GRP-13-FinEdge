import express from "express";
import userController from "./users.controller.js";
import usersValidator from "./users.validator.js";
import validate from "../../shared/middleware/validate.middleware.js";
import authenticate from "../../shared/middleware/authenticate.middleware.js";

const router = express.Router();

router.get("/", authenticate, userController.getUser);
router.post("/signup", validate(usersValidator.createUserSchema), userController.signup);
router.post("/login", validate(usersValidator.loginUserSchema), userController.login);
router.put("/preferences", authenticate, validate(usersValidator.updateUserPreferencesSchema), userController.updateUserPreferences);

export default router;
