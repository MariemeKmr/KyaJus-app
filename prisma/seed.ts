import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const motDePasse = await bcrypt.hash("superadmin123", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@kyajus.sn" },
    update: {},
    create: {
      nom: "Super Admin",
      email: "superadmin@kyajus.sn",
      motDePasse,
      role: Role.SUPER_ADMIN,
    },
  });

  await prisma.parametreFinance.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, tauxReinvestissement: 0 },
  });

  console.log("Seed termine : superadmin@kyajus.sn / superadmin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());