import bcrypt from "bcrypt";

import User from "./users.model.js";
import invalidatedTokenCache from "../../shared/utils/token-cache.js";
import {
  createTokenPair,
  getTokenRemainingTtlMs,
} from "../../shared/utils/jwt.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors/errors.js";

const SALT_ROUNDS = 10;

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

  if (!user.password) {
    throw new BadRequestError("Password login is not available for this account");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid password");
  }

  const { accessToken, refreshToken } = createTokenPair(user);
  return { user, accessToken, refreshToken };
};

const logout = async ({ userId, token, decodedToken }) => {
  const ttlMs = getTokenRemainingTtlMs(decodedToken);
  invalidatedTokenCache.invalidate(token, ttlMs);

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { authVersion: 1 } },
    { new: true },
  );

  if (!user) {
    throw new UnauthorizedError("User not found for logout");
  }

  return { loggedOut: true, authVersion: user.authVersion };
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

const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new BadRequestError("Email not found in Google profile");
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: profile.displayName || profile.name?.givenName || "User",
      email,
      password: null,
      provider: "google",
    });
  }
  return user;
};

const googleCallback = async (user) => {
  const { accessToken, refreshToken } = createTokenPair(user);
  return { user, accessToken, refreshToken };
};

export default {
  signup,
  login,
  logout,
  updateUserPreferences,
  getUser,
  findOrCreateGoogleUser,
  googleCallback,
};
