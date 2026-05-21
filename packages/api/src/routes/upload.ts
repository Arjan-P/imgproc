import type { FastifyPluginAsync } from "fastify";
import type { UploadResponse } from "@imgproc/shared";
import { BadRequestError } from "../errors/index.js";

export const uploadRoute: FastifyPluginAsync = async (app) => {
  app.post<{ Reply: UploadResponse }>("/upload", async (req) => {
    const file = await req.file();
    if (!file) {
      throw new BadRequestError("File missing");
    }

    const jobId = crypto.randomUUID();
    const s3Key = `originals/${jobId}/${file.filename}`;

    // TODO: write raw bytes to real S3
    const chunks: Buffer[] = [];
    for await (const chunk of file.file) chunks.push(chunk);
    const buf = Buffer.concat(chunks);

    // write job record
    await app.db`
      INSERT INTO jobs (id, s3_key_in, status, ops)
      VALUES (${jobId}, ${s3Key}, ${"pending"}, ${"[]"}::jsonb)
    `;

    await app.queue.add("process", {
      jobId,
      s3Key,
      buf: buf.toString("base64"), // TODO: replace with S3 key
    });

    return { jobId };
  });
};
