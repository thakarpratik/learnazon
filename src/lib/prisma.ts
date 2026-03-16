/**
 * Prisma client singleton with pg adapter (Prisma 7+).
 * Uses a Proxy so the client is never instantiated at build time —
 * only on first actual database call at runtime.
 */

type AnyPrismaClient = any;

const g = globalThis as any;

function createPrismaClient(): AnyPrismaClient {
  const { PrismaClient } = require("@prisma/client");   
  const { PrismaPg }    = require("@prisma/adapter-pg"); 

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your .env or .env.local file."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getClient(): AnyPrismaClient {
  if (!g._prisma) g._prisma = createPrismaClient();
  return g._prisma;
}

export const prisma: AnyPrismaClient = new Proxy(
  {},
  { get(_t, prop) { return getClient()[prop]; } }
);
