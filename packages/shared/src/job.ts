import type { Op } from "./op.js";

export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  ops: Op[];
  s3KeyIn: string;
  s3KeyOut: string | null;
  createdAt: string; // ISO 8601
  doneAt: string | null;
}

export type JobProgress = {
  id: string;
  status: JobStatus;
  progress: number;
};
