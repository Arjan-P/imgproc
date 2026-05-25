import { env } from "./env/env.js";
import type { RedisOptions } from "ioredis";

export const redisOptions: RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
};
