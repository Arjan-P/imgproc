import "fastify";
import "@fastify/jwt";
import { JWTUser } from "./jwt.ts";

declare module "fastify" {
  interface FastifyRequest {
    rawBody?: string | Buffer;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JWTUser;
    user: JWTUser;
  }
}
