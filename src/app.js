import "dotenv/config";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import session from "express-session";

import passport from "./config/passport.js";
import openapiSpecification from "./config/swagger.js";
import budgetRoutes from "./modules/budget/budget.routes.js";
import suggestRoutes from "./modules/suggest/suggest.routes.js";
import transactionsRoutes from "./modules/transactions/transactions.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import { httpLogger } from "./shared/logger/index.js";
import { errorHandler } from "./shared/middleware/error.middleware.js";
import rateLimiter from "./shared/middleware/ratelimit.middleware.js";

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
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/docs/openapi.json", (_req, res) => {
  res.json(openapiSpecification);
});
app.use("/docs", express.static("docs"));

app.use("/api/v1/users", httpLogger, usersRoutes);
app.use("/api/v1/transactions", httpLogger, transactionsRoutes);
app.use("/api/v1/suggest", httpLogger, suggestRoutes);
app.use("/api/v1/budget", httpLogger, budgetRoutes);

app.use(errorHandler);

export default app;
