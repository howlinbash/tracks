import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
  console.log("Records created successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    void prisma.$disconnect();
  });
