import postgres from "postgres";
import bcrypt from "bcrypt";

import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../../errors/index.js";

import type { LoginBodyType, SignupBodyType } from "./auth.schema.js";

import type { JWTUser } from "../../types/jwt.js";

function toJwtUser(row: any): JWTUser {
  return {
    sub: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

export function makeAuthService(db: ReturnType<typeof postgres>) {
  return {
    async signup(input: SignupBodyType) {
      const existing = await db`
        SELECT id
        FROM users
        WHERE email = ${input.email}
        LIMIT 1
      `;

      if (existing.length > 0) {
        throw new ConflictError("Email already exists");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);

      const [user] = await db`
        INSERT INTO users (
          email,
          password_hash,
          first_name,
          last_name
        )
        VALUES (
          ${input.email},
          ${passwordHash},
          ${input.firstName},
          ${input.lastName}
        )
        RETURNING *
      `;

      return toJwtUser(user);
    },

    async login(input: LoginBodyType) {
      const [user] = await db`
        SELECT *
        FROM users
        WHERE email = ${input.email}
        LIMIT 1
      `;

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(
        input.password,
        user.password_hash,
      );

      if (!validPassword) {
        throw new AuthenticationError("Invalid credentials");
      }

      return toJwtUser(user);
    },

    async me(userId: string) {
      const [user] = await db`
        SELECT *
        FROM users
        WHERE id = ${userId}
        LIMIT 1
      `;

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return toJwtUser(user);
    },
  };
}
