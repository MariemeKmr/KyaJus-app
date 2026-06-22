import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const jus = [
  "Bouye lait",
  "Bouye goyave",
  "Bouye bissap",
  "Bissap",
  "Bissap blanc",
  "Ginger",
  "Ditakh",
  "Citron",
  "Tamarin",
  "Maad",
  "Pasteque",
  "Orange",
];

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

  // Creation des 12 jus si absents. Les prix sont a 0 et doivent etre
  // ajustes ensuite depuis l'espace Produits.
  for (const nom of jus) {
    const existe = await prisma.produit.findFirst({ where: { nom } });
    if (!existe) {
      await prisma.produit.create({
        data: { nom, prixVente: 0, prixRevient: 0, stock: 0, actif: true },
      });
    }
  }

  console.log("Seed termine : super admin, parametre finance et 12 jus (prix a definir).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
