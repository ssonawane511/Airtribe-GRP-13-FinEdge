import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const buildLimiter = ({ max, message, keyGenerator }) =>
  rateLimit({
    windowMs: 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
    keyGenerator,
    handler: (_req, res, _next, options) => {
      res.status(options.statusCode || 429).json({
        success: false,
        message: options.message,
      });
    },
  });

const fallbackKey = (req) => ipKeyGenerator(req.ip || "anonymous");

export const rateLimiter = buildLimiter({
  max: 100,
  message: "Too many requests, please try again later.",
  keyGenerator: fallbackKey,
});

export const authRateLimiter = buildLimiter({
  max: 10,
  message: "Too many authentication requests, please try again later.",
  keyGenerator: (req) =>
    req.user?.id || req.body?.email || fallbackKey(req),
});

export default rateLimiter;
