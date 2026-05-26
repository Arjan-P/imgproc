import type { Op } from "./op.js";

export interface SavedPipeline {
  id: string;
  userId: string;
  name: string;
  ops: Op[];
  createdAt: string;
  updatedAt: string;
}

export type PipelineListItem = Omit<SavedPipeline, "userId">;
