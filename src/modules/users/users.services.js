import User from "./users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { NotFoundError } from "../../shared/errors/errors.js";
import { BadRequestError } from "../../shared/errors/errors.js";
import { ConflictError } from "../../shared/errors/errors.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const signup = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid password");
  }
  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
  return { user, accessToken, refreshToken };
};

const updateUserPreferences = async (userId, preferences) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { preferences },
    { new: true },
  );
  return { preferences: user.preferences };
};

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export default {
  signup,
  login,
  updateUserPreferences,
  getUser,
};
