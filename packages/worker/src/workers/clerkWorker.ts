import type { WebhookEvent } from "@clerk/fastify";
import { Worker } from "bullmq";

import { logger } from "../utils/logger.js";
import { redisOptions } from "../config/redis.js";
import { db } from "../utils/db.js";

export const clerkWorker = new Worker(
  "Clerk-Webhook-Queue",
  async (job) => {
    const event = job.data as WebhookEvent;

    logger.info(
      { jobId: job.id, type: event.type },
      "Processing Clerk Webhook",
    );

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const user = event.data;

        const primaryEmail = user.email_addresses.find(
          (e) => e.id === user.primary_email_address_id,
        );

        await db`
        INSERT INTO users (
          id,
          email_address,
          first_name,
          last_name,
          image_url
        )
        VALUES (
          ${user.id},
          ${primaryEmail?.email_address ?? null},
          ${user.first_name},
          ${user.last_name},
          ${user.image_url}
        )
        ON CONFLICT (id)
        DO UPDATE SET
          email_address = EXCLUDED.email_address,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          image_url = EXCLUDED.image_url,
          updated_at = now()
        `;
        break;
      }
      case "user.deleted": {
        const user = event.data;

        if (!user.id) break;

        await db`
        DELETE FROM users
        WHERE id = ${user.id}
        `;

        break;
      }

      default:
        logger.warn({ type: event.type }, "Unhandled event");
    }
  },
  {
    connection: redisOptions,
  },
);

clerkWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Job completed");
});

clerkWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Job failed");
});
