import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import logger from "./shared/logger/index.js";
import connectDB from "./config/database.js";

// routes 
import usersRoutes from "./modules/users/users.routes.js";

// middleware
import { errorHandler } from "./shared/middleware/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api", usersRoutes);

// Error handler must be registered AFTER all routes
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
