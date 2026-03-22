/**
 * Prisma client singleton (Prisma 7 + pg adapter).
 * Lazy proxy — never instantiates at build time.
 */

const g = globalThis as { _prisma?: unknown };

function createPrismaClient() {
  const { PrismaClient } = require("@prisma/client"); // eslint-disable-line
  const { PrismaPg } = require("@prisma/adapter-pg"); // eslint-disable-line
  const { Pool } = require("pg"); // eslint-disable-line

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (local) or Vercel Environment Variables (production)."
    );
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function getClient() {
  if (!g._prisma) g._prisma = createPrismaClient();
  return g._prisma as ReturnType<typeof createPrismaClient>;
}

export const prisma = new Proxy({} as ReturnType<typeof createPrismaClient>, {
  get(_t, prop) {
    return (getClient() as any)[prop]; // eslint-disable-line
  },
});
