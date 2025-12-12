import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isNeonUrl = process.env.DATABASE_URL.includes('neon.tech') || process.env.DATABASE_URL.includes('neon-');

let db: any;

if (isNeonUrl) {
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzleNeon({ client: sql, schema });
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema });
}

export { db };
