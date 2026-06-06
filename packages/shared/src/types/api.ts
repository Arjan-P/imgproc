import { z } from "zod";
import { errorResponse } from "../schemas/response.schema.js";
import { Op } from "./op.js";
import { PipelineListItem, SavedPipeline } from "./pipeline.js";

export const ERROR_CODES = [
  // Generic
  "AUTHENTICATION_ERROR",
  "CONFLICT_ERROR",
  "NOT_FOUND_ERROR",
  "BAD_REQUEST_ERROR",
  "VALIDATION_ERROR",
  "INTERNAL_SERVER_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type SuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    message?: string;
  };
};
export type ErrorResponse = z.infer<typeof errorResponse>;

// /api/pipelines:

// POST /api/pipelines
export interface CreatePipelineRequest {
  name: string;
  ops: Op[];
}
export type CreatePipelineResponse = SavedPipeline;

// GET /api/pipelines
export interface ListPipelinesResponse {
  pipelines: PipelineListItem[];
}

// GET /api/pipelines/:id
export type GetPipelineResponse = SavedPipeline;

// PATCH /api/pipelines/:id
export interface UpdatePipelineRequest {
  name?: string;
  ops?: Op[];
}
export type UpdatePipelineResponse = SavedPipeline;
