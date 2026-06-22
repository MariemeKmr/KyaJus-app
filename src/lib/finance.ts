import { prisma } from "@/lib/prisma";

export function formatFCFA(montant: number) {
  return Math.round(montant).toLocaleString("fr-FR") + " FCFA";
}

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