import fp from "fastify-plugin";
import { Redis } from "ioredis";
import { env } from "../config/env/env.js";

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis;
  }
}

export const redisPlugin = fp(async (app) => {
  const redis = new Redis(env.REDIS_HOST);
  app.decorate("redis", redis);
  app.addHook("onClose", async () => redis.quit());
});
