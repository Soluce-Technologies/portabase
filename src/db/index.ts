import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { env } from "@/env.mjs";
import * as schema from "./schema";

dotenv.config({
    path: ".env",
});

export const db = drizzle(env.DATABASE_URL!, {
    schema,
});
