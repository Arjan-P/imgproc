import fp from "fastify-plugin";
import { Redis } from "ioredis";
import { redisOptions } from "../config/redis.js";

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis;
  }
}

export const redisPlugin = fp(async (app) => {
  const redis = new Redis(redisOptions);
  app.decorate("redis", redis);
  app.addHook("onClose", async () => redis.quit());
});
