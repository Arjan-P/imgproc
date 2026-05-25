import { z } from "zod";
import type { Op } from "./op.js";
import type { Job, JobProgress } from "./job.js";
import { errorResponse } from "../schemas/response.schema.js";

export const ERROR_CODES = [
  // Generic
  "NOT_FOUND",
  "BAD_REQUEST",
  "VALIDATION_ERROR",
  "INTERNAL_SERVER_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type ErrorResponse = z.infer<typeof errorResponse>;

export interface UploadResponse {
  jobId: string;
}

export interface SubmitOpsRequest {
  ops: Op[];
}

export type GetJobResponse = Job;

export interface JobResultResponse {
  url: string;
  expiresAt: string;
}

export type ProgressEvent = JobProgress;
