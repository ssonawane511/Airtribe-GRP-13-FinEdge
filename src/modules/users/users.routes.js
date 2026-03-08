import express from "express";
import userController from "./users.controller.js";
import usersValidator from "./users.validator.js";
import validate from "../../shared/middleware/validate.middleware.js";

const router = express.Router();

router.use("/v1/users", router)
  .post("/signup", validate(usersValidator.createUserSchema), userController.signup)
  .post("/login", validate(usersValidator.loginUserSchema), userController.login)

export default router;
