"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { DepenseInput } from "@/lib/types";

async function verifierAcces() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    throw new Error("Acces refuse");
  }
}

export async function creerDepense(data: DepenseInput) {
  await verifierAcces();

  if (!data.categorie.trim()) throw new Error("Categorie obligatoire");
  if (data.montant <= 0) throw new Error("Montant invalide");

  const session = await auth();

  await prisma.depense.create({
    data: {
      categorie: data.categorie.trim(),
      montant: data.montant,
      description: data.description.trim() || null,
      date: new Date(data.date),
      createdById: session?.user?.id ?? null,
    },
  });

  revalidatePath("/admin/depenses");
  revalidatePath("/admin/dashboard");
}

export async function supprimerDepense(id: string) {
  await verifierAcces();
  await prisma.depense.delete({ where: { id } });
  revalidatePath("/admin/depenses");
  revalidatePath("/admin/dashboard");
}
