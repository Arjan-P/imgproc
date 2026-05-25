import "./workers/clerkWorker.js";

import { logger } from "./utils/logger.js";
import { db } from "./utils/db.js";

logger.info("Worker process started");

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down");

  await db.end();

  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down");

  await db.end();

  process.exit(0);
});

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled promise rejection");
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");

  process.exit(1);
});
