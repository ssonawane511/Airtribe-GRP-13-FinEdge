import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  handler: (req, res, next, options) => {
    res.status(options.statusCode || 429).json({
      success: false,
      message: options.message,
    });
  },
});

export default rateLimiter;
