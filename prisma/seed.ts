import { PrismaClient } from "@prisma/client";
import { seed } from "../lib/seed";

const prisma = new PrismaClient();

seed(prisma)
  .then((n) => console.log(`Seeded ${n} venues in Larkspur Falls.`))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
