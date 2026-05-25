import { clerkAdapter } from "./adapter/clerk.adapter.js";

export const webhookRegistry = {
  clerk: clerkAdapter,
} as const;
