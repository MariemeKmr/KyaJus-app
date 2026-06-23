import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/format";

// Re-export pour conserver les imports existants depuis "@/lib/finance".
export { formatFCFA };

export async function getResumeFinance() {
  const commandesPayees = await prisma.commande.findMany({
    where: { paye: true },
    include: { lignes: true },
  });

  const revenus = commandesPayees.reduce((s, c) => s + Number(c.total), 0);
  const coutMarchandises = commandesPayees.reduce(
    (s, c) => s + c.lignes.reduce((sl, l) => sl + Number(l.coutUnitaire) * l.quantite, 0),
    0
  );

  const depAgg = await prisma.depense.aggregate({ _sum: { montant: true } });
  const depenses = Number(depAgg._sum.montant ?? 0);

  const param = await prisma.parametreFinance.findUnique({ where: { id: 1 } });
  const taux = Number(param?.tauxReinvestissement ?? 0) / 100;

  const margeBrute = revenus - coutMarchandises;
  const beneficeNet = margeBrute - depenses;
  const montantReinvesti = beneficeNet > 0 ? beneficeNet * taux : 0;
  const beneficeARepartir = beneficeNet - montantReinvesti;

  return {
    revenus,
    coutMarchandises,
    depenses,
    margeBrute,
    beneficeNet,
    montantReinvesti,
    beneficeARepartir,
    taux: taux * 100,
  };
}

// Repartition du benefice a repartir entre les investisseurs, selon leur part.
export async function getRepartition() {
  const resume = await getResumeFinance();
  const investisseurs = await prisma.investisseur.findMany({ orderBy: { nom: "asc" } });

  return investisseurs.map((i) => ({
    id: i.id,
    nom: i.nom,
    userId: i.userId,
    montantInvesti: Number(i.montantInvesti),
    partPourcent: Number(i.partPourcent),
    part: (Number(i.partPourcent) / 100) * resume.beneficeARepartir,
  }));
}
