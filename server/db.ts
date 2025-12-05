import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isNeonUrl = process.env.DATABASE_URL.includes('neon.tech') || process.env.DATABASE_URL.includes('neon-');

let db: any;

if (isNeonUrl) {
  // Use Neon serverless driver for Neon databases
  const { drizzle } = require("drizzle-orm/neon-http");
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzle({ client: sql, schema });
} else {
  // Use standard pg driver for local/regular PostgreSQL
  const { drizzle } = require("drizzle-orm/node-postgres");
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db };
