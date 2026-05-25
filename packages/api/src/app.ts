import Fastify, { type FastifyInstance } from "fastify";
import { securityPlugin } from "./plugins/security.js";
import { dbPlugin } from "./plugins/db.js";
import { redisPlugin } from "./plugins/redis.js";
import { queuePlugin } from "./plugins/queue.js";
import { loggerConfig } from "./config/logger.js";
import { zodPlugin } from "./plugins/zod.js";
import { protectedRoutes } from "./routes/protected.js";
import { webhookRoute } from "./routes/webhook.js";

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerConfig });

  await app.register(securityPlugin);
  await app.register(dbPlugin);
  await app.register(redisPlugin);
  await app.register(queuePlugin);
  await app.register(zodPlugin);

  await app.register(
    async (api) => {
      api.register(webhookRoute);
      api.register(protectedRoutes);
    },
    { prefix: "/api" },
  );

  return app;
}
