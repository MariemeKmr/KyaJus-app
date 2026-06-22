// Formatage isole sans dependance Prisma, pour pouvoir l'importer aussi
// bien cote serveur que cote client.
export function formatFCFA(montant: number) {
  return Math.round(montant).toLocaleString("fr-FR") + " FCFA";
}
