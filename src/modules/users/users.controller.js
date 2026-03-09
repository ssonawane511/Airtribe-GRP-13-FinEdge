import userService from "./users.services.js";
import { successResponse } from "../../shared/utils/response.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userService.signup(name, email, password);
  successResponse(res, user, "User created successfully", 201);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.login(email, password);
  successResponse(res, user, "User logged in successfully", 200);
};

const updateUserPreferences = async (req, res) => {
  const { preferences } = req.body;
  const userId = req.user.id;
  const user = await userService.updateUserPreferences(userId, preferences);
  successResponse(res, user, "User preferences updated successfully", 200);
};

const getUser = async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUser(userId);
  successResponse(res, user, "User fetched successfully", 200);
};

export default {
  signup,
  login,
  updateUserPreferences,
  getUser,
};
