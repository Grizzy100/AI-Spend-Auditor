/**
 * Prisma v7 singleton — uses PrismaPg driver adapter (required in v7).
 * Import `prisma` from this file everywhere instead of instantiating PrismaClient directly.
 */
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Initialize pg connection using serverless-friendly adapter for Edge compatibility
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // SSL required for Neon PostgreSQL
  ssl: { rejectUnauthorized: false },
});

export const prisma = new PrismaClient({ adapter });
