import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import InvestisseursClient from "@/components/admin/InvestisseursClient";

export default async function InvestisseursPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin/dashboard");

  const investisseurs = await prisma.investisseur.findMany({ orderBy: { nom: "asc" } });

  const liste = investisseurs.map((i) => ({
    id: i.id,
    nom: i.nom,
    montantInvesti: Number(i.montantInvesti),
    partPourcent: Number(i.partPourcent),
    aAcces: !!i.userId,
  }));

  return <InvestisseursClient investisseurs={liste} />;
}
