import { prisma } from "@/lib/db";
import { getSession } from "@/lib/guard";

// Accueil de l'espace Élève : emploi du temps, ressources et exercices
// de sa classe. Pour l'instant on affiche les informations de base ;
// les modules interactifs viendront ensuite.
export default async function ElevesAccueil() {
  const session = await getSession();

  const eleve = await prisma.eleve.findUnique({
    where: { utilisateurId: session!.user.id },
    include: { classe: true },
  });

  if (!eleve) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Espace élève</h1>
        <p>Aucun profil élève associé à ce compte.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>
        Bonjour {eleve.prenom} 👋
      </h1>
      <p>
        Classe : <strong>{eleve.classe?.nom ?? "non affectée"}</strong>
      </p>
      <p style={{ marginTop: 16, opacity: 0.6, fontSize: ".85rem" }}>
        Prochaines briques : emploi du temps, ressources de cours, exercices et quiz.
      </p>
    </main>
  );
}
