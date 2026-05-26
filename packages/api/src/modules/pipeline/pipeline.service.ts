import postgres from "postgres";
import { NotFoundError } from "../../errors/index.js";
import type {
  CreatePipelineInput,
  UpdatePipelineInput,
} from "./pipeline.schema.js";
import type { SavedPipeline } from "@imgproc/shared";

function toSavedPipeline(row: any): SavedPipeline {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    ops: row.ops,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function makePipelineService(db: ReturnType<typeof postgres>) {
  return {
    async list(userId: string) {
      const rows = await db`
        SELECT id, user_id, name, ops, created_at, updated_at
        FROM pipelines
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
        LIMIT 100
      `;
      return rows.map(toSavedPipeline);
    },

    async get(id: string, userId: string) {
      const [row] = await db`
        SELECT * FROM pipelines
        WHERE id = ${id} AND user_id = ${userId}
      `;
      if (!row) throw new NotFoundError("Pipeline not found");
      return toSavedPipeline(row);
    },

    async create(userId: string, input: CreatePipelineInput) {
      const [row] = await db`
        INSERT INTO pipelines (user_id, name, ops)
        VALUES (${userId}, ${input.name}, ${db.json(input.ops)})
        RETURNING *
      `;
      return toSavedPipeline(row);
    },

    async update(id: string, userId: string, input: UpdatePipelineInput) {
      const [row] = await db`
        UPDATE pipelines SET
          name = COALESCE(${input.name ?? null}, name),
          ops  = COALESCE(${input.ops ? db.json(input.ops) : null}, ops)
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      if (!row) throw new NotFoundError("Pipeline not found");
      return toSavedPipeline(row);
    },

    async remove(id: string, userId: string) {
      const result = await db`
        DELETE FROM pipelines
        WHERE id = ${id} AND user_id = ${userId}
      `;
      if (result.count === 0) throw new NotFoundError("Pipeline not found");
    },
  };
}
