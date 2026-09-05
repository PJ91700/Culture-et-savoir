import { prisma } from "@/lib/db";
import { getSession } from "@/lib/guard";

// Accueil de l'espace Parents : liste les enfants de la famille et l'état
// de leur inscription (le paiement conditionne la validation).
export default async function ParentsAccueil() {
  const session = await getSession();

  // On retrouve la famille rattachée au compte parent connecté.
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session!.user.id },
    include: {
      famille: {
        include: {
          eleves: {
            include: { inscription: true, classe: true },
          },
        },
      },
    },
  });

  const enfants = utilisateur?.famille?.eleves ?? [];

  type EnfantAffiche = {
    id: string;
    prenom: string;
    nom: string;
    classe: { nom: string } | null;
    inscription: { statut: string } | null;
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Espace parents</h1>

      {enfants.length === 0 ? (
        <p>
          Aucun enfant enregistré pour le moment.{" "}
          <a href="/inscription">Inscrire un enfant</a>.
        </p>
      ) : (
        <ul>
          {(enfants as EnfantAffiche[]).map((enfant) => (
            <li key={enfant.id}>
              <strong>
                {enfant.prenom} {enfant.nom}
              </strong>{" "}
              — {enfant.classe?.nom ?? "classe non affectée"} —{" "}
              {statutLisible(enfant.inscription?.statut)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function statutLisible(statut?: string) {
  switch (statut) {
    case "VALIDEE":
      return "inscription validée";
    case "EN_ATTENTE_PAIEMENT":
      return "en attente de paiement";
    case "REFUSEE":
      return "inscription refusée";
    default:
      return "pas d'inscription en cours";
  }
}
