"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import type { InvestisseurInput } from "@/lib/types";

async function verifierSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Acces refuse");
  }
}

export async function creerInvestisseur(data: InvestisseurInput) {
  await verifierSuperAdmin();

  if (!data.nom.trim()) throw new Error("Le nom est obligatoire");

  let userId: string | null = null;

  if (data.creerAcces) {
    if (!data.email.trim() || !data.motDePasse.trim()) {
      throw new Error("Email et mot de passe requis pour creer un acces");
    }
    const existe = await prisma.user.findUnique({ where: { email: data.email.trim() } });
    if (existe) throw new Error("Cet email est deja utilise");

    const hash = await bcrypt.hash(data.motDePasse, 10);
    const user = await prisma.user.create({
      data: {
        nom: data.nom.trim(),
        email: data.email.trim(),
        motDePasse: hash,
        role: "ADMIN",
      },
    });
    userId = user.id;
  }

  await prisma.investisseur.create({
    data: {
      nom: data.nom.trim(),
      montantInvesti: data.montantInvesti,
      partPourcent: data.partPourcent,
      userId,
    },
  });

  revalidatePath("/admin/investisseurs");
  revalidatePath("/admin/dashboard");
}

export async function modifierInvestisseur(
  id: string,
  data: { nom: string; montantInvesti: number; partPourcent: number }
) {
  await verifierSuperAdmin();

  await prisma.investisseur.update({
    where: { id },
    data: {
      nom: data.nom.trim(),
      montantInvesti: data.montantInvesti,
      partPourcent: data.partPourcent,
    },
  });

  revalidatePath("/admin/investisseurs");
  revalidatePath("/admin/dashboard");
}

export async function supprimerInvestisseur(id: string) {
  await verifierSuperAdmin();

  const inv = await prisma.investisseur.findUnique({ where: { id } });
  if (!inv) return;

  await prisma.investisseur.delete({ where: { id } });

  // Supprime aussi le compte d'acces cree pour cet investisseur, le cas echeant.
  if (inv.userId) {
    await prisma.user.delete({ where: { id: inv.userId } }).catch(() => {});
  }

  revalidatePath("/admin/investisseurs");
  revalidatePath("/admin/dashboard");
}
