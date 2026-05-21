import type { Op } from "./op.js";
import type { Job, JobProgress } from "./job.js";

export const ERROR_CODES = [
  // Generic
  "NOT_FOUND",
  "BAD_REQUEST",
  "VALIDATION_ERROR",
  "INTERNAL_SERVER_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/**
 * Generic success response
 */
export type SuccessResponse<T> = {
  success: true;
  data: T;
  meta: unknown;
};

/**
 * Generic error response
 */
export type ErrorResponse = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details: unknown;
  };
};

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
