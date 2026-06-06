import { z } from "zod";

export const signupBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type SignupBodyType = z.infer<typeof signupBodySchema>;
export type LoginBodyType = z.infer<typeof loginBodySchema>;
