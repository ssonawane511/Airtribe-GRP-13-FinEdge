import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export const buildTokenPayload = (user, overrides = {}) => ({
  userId: user.id,
  authVersion: user.authVersion,
  ...overrides,
});

export const signAccessToken = (user) =>
  jwt.sign(
    buildTokenPayload(user, { jti: uuidv4(), tokenType: "access" }),
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

export const signRefreshToken = (user) =>
  jwt.sign(
    buildTokenPayload(user, { jti: uuidv4(), tokenType: "refresh" }),
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN },
  );

export const createTokenPair = (user) => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user),
});

export const getTokenRemainingTtlMs = (decodedToken) => {
  if (!decodedToken?.exp) {
    return 0;
  }

  return Math.max(decodedToken.exp * 1000 - Date.now(), 0);
};
