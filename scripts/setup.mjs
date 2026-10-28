// Local development helper: creates .env (with a random signing secret) the
// first time, and stops with a clear message until a database URL is filled in.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

if (!existsSync(".env")) {
  const secret = randomBytes(32).toString("hex");
  writeFileSync(
    ".env",
    readFileSync(".env.example", "utf8").replace("change-me-to-a-long-random-string", secret)
  );
  console.log("Created .env with a fresh PASS_SIGNING_SECRET.");
}

if (readFileSync(".env", "utf8").includes("USER:PASSWORD@HOST")) {
  console.error("\nAdd your Postgres connection strings to .env first (see README → Run it on your computer).\n");
  process.exit(1);
}
