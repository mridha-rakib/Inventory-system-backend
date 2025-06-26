import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import logger from "./utils/logger.js";

import { verifyUploadDir } from "./utils/upload.js";

(async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    logger.info(`Server running on port ${process.env.PORT}`);
  });
  if (!verifyUploadDir()) {
    console.error("FATAL: Upload directory not accessible");
    process.exit(1);
  }
  app.on("error", (error) => {
    logger.error(`❌ Server error: ${error}`);
  });

  process.on("unhandledRejection", (error) => {
    logger.error(`❌ Unhandled rejection: ${error}`);
  });

  process.on("uncaughtException", (error) => {
    logger.error(`❌ Uncaught exception: ${error}`);
  });

  process.on("exit", () => {
    logger.warn("👋 Bye bye!");
  });

  process.on("SIGINT", () => {
    logger.warn("👋 Bye bye!");
  });
})();
