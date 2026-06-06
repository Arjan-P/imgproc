import { FastifyPluginAsync } from "fastify";
import { pipelineRoutes } from "../modules/pipeline/pipeline.route.js";

export const protectedRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.register(pipelineRoutes);
};
