import { FastifyPluginAsync } from "fastify";
import webhookRoutes from "../modules/webhook/webhook.route.js";

export const webhookRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(webhookRoutes, { prefix: "/webhook" });
};
