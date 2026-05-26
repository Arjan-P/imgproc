import { z } from "zod";

const opSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("resize"),
    nw: z.number().int().min(1),
    nh: z.number().int().min(1),
  }),
  z.object({ type: z.literal("grayscale") }),
  z.object({ type: z.literal("invert") }),
]);

export const savedPipelineSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  name: z.string(),
  ops: z.array(z.any()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createPipelineSchema = z.object({
  name: z.string().min(1).max(120).default("Untitled pipeline"),
  ops: z.array(opSchema).max(50),
});

export const updatePipelineSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  ops: z.array(opSchema).max(50).optional(),
});

export const pipelineIdSchema = z.object({ id: z.uuid() });

export type CreatePipelineInput = z.infer<typeof createPipelineSchema>;
export type UpdatePipelineInput = z.infer<typeof updatePipelineSchema>;
export type PipelineIdParam = z.infer<typeof pipelineIdSchema>;
