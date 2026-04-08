import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Try multiple possible env file locations
const envPaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, ".env.local"),
  path.resolve(__dirname, ".env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const url = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

if (!url) {
  throw new Error(
    `DATABASE_URL is not set. Checked:\n${envPaths.join("\n")}\n\nMake sure your .env.local file is in: ${process.cwd()}`
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url,
    ...(directUrl ? { directUrl } : {}),
  },
});
