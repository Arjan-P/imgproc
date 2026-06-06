import type { FastifyReply, FastifyRequest } from "fastify";

import { ok } from "../../utils/response.js";

import { makeAuthService } from "./auth.service.js";

import type { LoginBodyType, SignupBodyType } from "./auth.schema.js";

async function signup(
  req: FastifyRequest<{ Body: SignupBodyType }>,
  reply: FastifyReply,
) {
  const svc = makeAuthService(req.server.db);

  const user = await svc.signup(req.body);

  const accessToken = req.server.jwt.sign(user);

  return reply.code(201).send(
    ok({
      accessToken,
      user: {
        userId: user.sub,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }),
  );
}

async function login(req: FastifyRequest<{ Body: LoginBodyType }>) {
  const svc = makeAuthService(req.server.db);

  const user = await svc.login(req.body);

  const accessToken = req.server.jwt.sign(user);

  return ok({
    accessToken,
    user: {
      userId: user.sub,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}

async function me(req: FastifyRequest) {
  return ok({
    user: {
      userId: req.user.sub,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
  });
}

export const AuthController = {
  signup,
  login,
  me,
};
