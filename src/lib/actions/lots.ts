"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { LotInput } from "@/lib/types";

async function verifierAcces() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    throw new Error("Acces refuse");
  }
}

// Recalcule le prix de revient du produit a partir de son dernier lot.
async function recomputerPrixRevient(produitId: string) {
  const dernierLot = await prisma.lotProduction.findFirst({
    where: { produitId },
    orderBy: { date: "desc" },
    include: { lignes: true },
  });

  if (!dernierLot || dernierLot.bouteillesProduites <= 0) return;

  const total = dernierLot.lignes.reduce((s, l) => s + Number(l.montant), 0);
  const coutUnitaire = total / dernierLot.bouteillesProduites;

  await prisma.produit.update({
    where: { id: produitId },
    data: { prixRevient: coutUnitaire },
  });
}

export async function creerLot(data: LotInput) {
  await verifierAcces();

  if (!data.produitId) throw new Error("Jus obligatoire");
  if (data.bouteillesProduites <= 0) throw new Error("Nombre de bouteilles invalide");

  const lignes = data.lignes
    .filter((l) => l.libelle.trim() && l.montant > 0)
    .map((l) => ({ libelle: l.libelle.trim(), montant: l.montant }));

  if (lignes.length === 0) throw new Error("Au moins une depense est requise");

  await prisma.lotProduction.create({
    data: {
      produitId: data.produitId,
      reference: data.reference.trim() || null,
      date: new Date(data.date),
      bouteillesProduites: data.bouteillesProduites,
      lignes: { create: lignes },
    },
  });

  await recomputerPrixRevient(data.produitId);
  revalidatePath("/admin/depenses");
  revalidatePath("/admin/produits");
}

export async function supprimerLot(id: string) {
  await verifierAcces();

  const lot = await prisma.lotProduction.findUnique({ where: { id } });
  if (!lot) return;

  await prisma.lotProduction.delete({ where: { id } });
  await recomputerPrixRevient(lot.produitId);

  revalidatePath("/admin/depenses");
  revalidatePath("/admin/produits");
}
