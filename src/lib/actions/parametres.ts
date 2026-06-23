"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function verifierSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Acces refuse");
  }
}

export async function definirTaux(taux: number) {
  await verifierSuperAdmin();

  const valeur = Math.min(100, Math.max(0, taux));

  await prisma.parametreFinance.upsert({
    where: { id: 1 },
    update: { tauxReinvestissement: valeur },
    create: { id: 1, tauxReinvestissement: valeur },
  });

  revalidatePath("/admin/parametres");
  revalidatePath("/admin/dashboard");
}
