import { FastifyPluginAsync } from "fastify";

import { ZodTypeProvider } from "@fastify/type-provider-zod";

import {
  authResponseSchema,
  meResponseSchema,
  errorResponse,
  successResponse,
} from "@imgproc/shared";

import { loginBodySchema, signupBodySchema } from "./auth.schema.js";

import { AuthController } from "./auth.controller.js";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/auth/signup",
    {
      schema: {
        body: signupBodySchema,
        response: {
          201: successResponse(authResponseSchema),
          409: errorResponse,
        },
      },
    },
    AuthController.signup,
  );

  app.post(
    "/auth/login",
    {
      schema: {
        body: loginBodySchema,
        response: {
          200: successResponse(authResponseSchema),
          401: errorResponse,
        },
      },
    },
    AuthController.login,
  );

  app.get(
    "/auth/me",
    {
      preHandler: fastify.authenticate,
      schema: {
        response: {
          200: successResponse(meResponseSchema),
          401: errorResponse,
        },
      },
    },
    AuthController.me,
  );
};
