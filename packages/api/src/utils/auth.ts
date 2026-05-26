import type { FastifyRequest } from "fastify";
import { getAuth } from "@clerk/fastify";
import { AuthenticationError } from "../errors/index.js";

export function requireUserId(req: FastifyRequest): string {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AuthenticationError();
  }

  return userId;
}
