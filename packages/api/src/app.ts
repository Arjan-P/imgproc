import Fastify, { type FastifyInstance } from "fastify";
import { securityPlugin } from "./plugins/security.js";
import { dbPlugin } from "./plugins/db.js";
import { loggerConfig } from "./config/logger.js";
import { zodPlugin } from "./plugins/zod.js";
import { protectedRoutes } from "./routes/protected.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { authPlugin } from "./plugins/auth.js";

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerConfig });

  await app.register(securityPlugin);
  await app.register(dbPlugin);
  await app.register(zodPlugin);
  await app.register(authPlugin);

  await app.register(
    async (api) => {
      api.register(authRoutes);
      api.register(protectedRoutes);
    },
    { prefix: "/api" },
  );

  return app;
}
