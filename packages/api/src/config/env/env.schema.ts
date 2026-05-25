import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), { message: "PORT must be a number" }),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),

  FRONTEND_URL: z.string(),

  DATABASE_URL: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), { message: "PORT must be a number" }),
});
