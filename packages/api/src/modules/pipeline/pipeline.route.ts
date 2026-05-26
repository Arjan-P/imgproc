import { z } from "zod";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { errorResponse, successResponse } from "@imgproc/shared";
import { FastifyPluginAsync } from "fastify";
import {
  createPipelineSchema,
  pipelineIdSchema,
  savedPipelineSchema,
  updatePipelineSchema,
} from "./pipeline.schema.js";
import { PipelineController } from "./pipeline.controller.js";

export const pipelineRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.get(
    "/pipelines",
    {
      schema: {
        response: {
          200: successResponse(
            z.object({ pipelines: z.array(savedPipelineSchema) }),
          ),
          401: errorResponse,
        },
      },
    },
    PipelineController.getPipelines,
  );
  app.get(
    "/pipelines/:id",
    {
      schema: {
        params: pipelineIdSchema,
        response: {
          200: successResponse(savedPipelineSchema),
          404: errorResponse,
        },
      },
    },
    PipelineController.getPipeline,
  );
  app.post(
    "/pipelines",
    {
      schema: {
        body: createPipelineSchema,
        response: {
          201: successResponse(savedPipelineSchema),
          400: errorResponse,
        },
      },
    },
    PipelineController.postPipeline,
  );
  app.patch(
    "/pipelines/:id",
    {
      schema: {
        params: pipelineIdSchema,
        body: updatePipelineSchema,
        response: {
          200: successResponse(savedPipelineSchema),
          404: errorResponse,
        },
      },
    },
    PipelineController.patchPipeline,
  );

  app.delete(
    "/pipelines/:id",
    {
      schema: { params: pipelineIdSchema },
    },
    PipelineController.deletePipeline,
  );
};
