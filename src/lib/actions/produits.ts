"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { ProduitFormData } from "@/lib/types";

async function verifierAcces() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    throw new Error("Acces refuse");
  }
}

export async function enregistrerProduit(data: ProduitFormData) {
  await verifierAcces();

  const valeurs = {
    nom: data.nom.trim(),
    description: data.description.trim() || null,
    prixVente: data.prixVente,
    prixRevient: data.prixRevient,
    stock: data.stock,
    actif: data.actif,
  };

  if (data.id) {
    await prisma.produit.update({ where: { id: data.id }, data: valeurs });
  } else {
    await prisma.produit.create({ data: valeurs });
  }

  revalidatePath("/admin/produits");
}

export async function supprimerProduit(id: string) {
  await verifierAcces();

  // Si le jus est deja lie a des commandes, on le desactive plutot que de le
  // supprimer pour eviter une erreur de cle etrangere.
  const lignes = await prisma.ligneCommande.count({ where: { produitId: id } });
  if (lignes > 0) {
    await prisma.produit.update({ where: { id }, data: { actif: false } });
  } else {
    await prisma.produit.delete({ where: { id } });
  }

  revalidatePath("/admin/produits");
}
