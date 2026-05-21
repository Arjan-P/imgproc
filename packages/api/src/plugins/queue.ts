import fp from "fastify-plugin";
import { Queue } from "bullmq";
import { env } from "../config/env/env.js";

declare module "fastify" {
  interface FastifyInstance {
    queue: Queue;
  }
}

export const queuePlugin = fp(async (app) => {
  const queue = new Queue("imgproc", {
    connection: { url: env.REDIS_HOST },
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    },
  });
  app.decorate("queue", queue);
  app.addHook("onClose", async () => queue.close());
});
