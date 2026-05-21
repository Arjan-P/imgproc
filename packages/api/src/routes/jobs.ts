import { type FastifyPluginAsync } from "fastify";
import { SuccessResponse, type GetJobResponse } from "@imgproc/shared";
import { NotFoundError } from "../errors/index.js";
import { ok } from "../utils/response.js";

export const jobsRoute: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string }; Reply: SuccessResponse<GetJobResponse> }>(
    "/jobs/:id",
    async (req, _reply) => {
      const [row] = await app.db`
        SELECT id, status, progress, ops, s3_key_in, s3_key_out,
               created_at, done_at
        FROM jobs WHERE id = ${req.params.id}
      `;
      if (!row) {
        throw new NotFoundError("Job not found");
      }
      return ok({
        id: row.id,
        status: row.status,
        progress: row.progress,
        ops: row.ops,
        s3KeyIn: row.s3_key_in,
        s3KeyOut: row.s3_key_out ?? null,
        createdAt: row.created_at.toISOString(),
        doneAt: row.done_at?.toISOString() ?? null,
      });
    },
  );
};
