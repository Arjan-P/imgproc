import fp from "fastify-plugin";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { env } from "../config/env/env.js";

export const securityPlugin = fp(async (app) => {
  // COOP/COEP headers — required for SharedArrayBuffer in the browser client
  await app.register(helmet, {
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 60,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
  });

  await app.register(multipart, {
    limits: { fileSize: 50 * 1024 * 1024 },
  });
});
