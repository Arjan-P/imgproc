import { Queue } from "bullmq";

import { redisOptions } from "../config/redis.js";

const queues = new Map<string, Queue>();

export function getQueue(name: string) {
  if (!queues.has(name)) {
    queues.set(
      name,
      new Queue(name, {
        connection: redisOptions,

        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      }),
    );
  }

  return queues.get(name)!;
}

export async function closeQueues() {
  await Promise.all([...queues.values()].map((queue) => queue.close()));
}
