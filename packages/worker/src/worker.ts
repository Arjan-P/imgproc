import { Worker } from "bullmq";
import { Redis } from "ioredis";
import postgres from "postgres";
import { runPipeline } from "./pipeline.js";
import { env } from "./config/env/env.js";

const redis = new Redis(env.REDIS_HOST);
const db = postgres(env.DATABASE_URL);

function publish(jobId: string, status: string, progress: number) {
  return redis.publish(
    `job:${jobId}:progress`,
    JSON.stringify({ id: jobId, status, progress }),
  );
}

const worker = new Worker(
  "imgproc",
  async (job) => {
    const { jobId, buf, s3Key } = job.data as {
      jobId: string;
      buf: string;
      s3Key: string;
    };

    await db`UPDATE jobs SET status='processing', progress=5 WHERE id=${jobId}`;
    await publish(jobId, "processing", 5);

    const [row] = await db`SELECT ops FROM jobs WHERE id=${jobId}`;
    const ops = row.ops;

    // decode the base64 stub replace with S3 download
    const pixels = Buffer.from(buf, "base64");

    await db`UPDATE jobs SET progress=20 WHERE id=${jobId}`;
    await publish(jobId, "processing", 20);

    const result = await runPipeline(pixels, ops);

    await db`UPDATE jobs SET progress=80 WHERE id=${jobId}`;
    await publish(jobId, "processing", 80);

    // just mark done (later uploads result to S3)
    const outKey = `outputs/${jobId}/result.png`;
    await db`
    UPDATE jobs SET status='done', progress=100,
      s3_key_out=${outKey}, done_at=now()
    WHERE id=${jobId}
  `;
    await publish(jobId, "done", 100);
  },
  { connection: { url: env.REDIS_HOST } },
);

worker.on("failed", async (job, err) => {
  if (!job) return;
  await db`UPDATE jobs SET status='failed' WHERE id=${job.data.jobId}`;
  await publish(job.data.jobId, "failed", 0);
  console.error("job failed", job.data.jobId, err);
});
