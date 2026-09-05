import { prisma } from "@/lib/db";

// Sécurité métier : s'assurer que le professeur connecté enseigne bien dans la
// classe qu'il tente de modifier. Sans cette vérification, un prof pourrait
// (via une requête forgée) émarger ou noter les élèves d'une autre classe.
//
// Renvoie le professeur s'il a accès, sinon null.
export async function professeurAccedeClasse(
  utilisateurId: string,
  classeId: string
) {
  const professeur = await prisma.professeur.findUnique({
    where: { utilisateurId },
    include: { classes: { where: { id: classeId }, select: { id: true } } },
  });

  if (!professeur) return null;
  // classes est filtré sur classeId : s'il est vide, le prof n'y enseigne pas.
  if (professeur.classes.length === 0) return null;

  return professeur;
}
