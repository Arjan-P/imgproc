import postgres from "postgres";
import { env } from "../config/env/env.js";

export const db = postgres(env.DATABASE_URL);
