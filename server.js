import "dotenv/config";
import app from "./src/app.js";
import logger from "./src/shared/logger/index.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("ENVIRONMENT", process.env.NODE_ENV);
      console.log("PORT", PORT);
      console.log("CORS_ORIGIN", CORS_ORIGIN.split(","));
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
