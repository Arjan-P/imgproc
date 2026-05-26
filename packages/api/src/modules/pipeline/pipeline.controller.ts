import type { FastifyReply, FastifyRequest } from "fastify";
import { requireUserId } from "../../utils/auth.js";
import { makePipelineService } from "./pipeline.service.js";
import { ok } from "../../utils/response.js";
import {
  CreatePipelineInput,
  PipelineIdParam,
  UpdatePipelineInput,
} from "./pipeline.schema.js";

async function getPipelines(req: FastifyRequest) {
  const userId = requireUserId(req);
  const svc = makePipelineService(req.server.db);
  return ok({ pipelines: await svc.list(userId) });
}

async function getPipeline(req: FastifyRequest<{ Params: PipelineIdParam }>) {
  const userId = requireUserId(req);
  const svc = makePipelineService(req.server.db);
  return ok(await svc.get(req.params.id, userId));
}

async function postPipeline(
  req: FastifyRequest<{ Body: CreatePipelineInput }>,
  reply: FastifyReply,
) {
  const userId = requireUserId(req);
  const svc = makePipelineService(req.server.db);
  return reply.code(201).send(ok(await svc.create(userId, req.body)));
}

async function patchPipeline(
  req: FastifyRequest<{ Params: PipelineIdParam; Body: UpdatePipelineInput }>,
) {
  const userId = requireUserId(req);
  const svc = makePipelineService(req.server.db);
  return ok(await svc.update(req.params.id, userId, req.body));
}

async function deletePipeline(
  req: FastifyRequest<{ Params: PipelineIdParam }>,
  reply: FastifyReply,
) {
  const userId = requireUserId(req);
  const svc = makePipelineService(req.server.db);
  await svc.remove(req.params.id, userId);
  return reply.code(204).send();
}

export const PipelineController = {
  getPipelines,
  getPipeline,
  postPipeline,
  patchPipeline,
  deletePipeline,
};
