import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";

import { httpLogger } from "./shared/logger/index.js";

// routes
import usersRoutes from "./modules/users/users.routes.js";
import transactionsRoutes from "./modules/transactions/transactions.routes.js";
import suggestRoutes from "./modules/suggest/suggest.routes.js";
import budgetRoutes from "./modules/budget/budget.routes.js";
// middleware
import { errorHandler } from "./shared/middleware/error.middleware.js";
import rateLimiter from "./shared/middleware/ratelimit.middleware.js";
import passport from "./config/passport.js";

const app = express();
app.set("trust proxy", 1);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const corsOptions = {
  origin: CORS_ORIGIN.split(","),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/users", httpLogger, usersRoutes);
app.use("/api/v1/transactions", httpLogger, transactionsRoutes);
app.use("/api/v1/suggest", httpLogger, suggestRoutes);
app.use("/api/v1/budget", httpLogger, budgetRoutes);

// Error handler must be registered AFTER all routes
app.use(errorHandler);

export default app;
