import { prisma } from "@/lib/db";
import { getSession } from "@/lib/guard";

// Accueil de l'espace Professeur : ses classes, point d'entrée vers
// l'émargement, le cahier de texte et le carnet de notes.
export default async function ProfesseursAccueil() {
  const session = await getSession();

  const professeur = (await prisma.professeur.findUnique({
    where: { utilisateurId: session!.user.id },
    include: {
      classes: { include: { _count: { select: { eleves: true } } } },
    },
  })) as {
    prenom: string;
    nom: string;
    classes: { id: string; nom: string; _count: { eleves: number } }[];
  } | null;

  if (!professeur) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Espace professeur</h1>
        <p>Aucun profil professeur associé à ce compte.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>
        Bonjour {professeur.prenom} {professeur.nom}
      </h1>
      <h2 style={{ marginTop: 16 }}>Mes classes</h2>

      {professeur.classes.length === 0 ? (
        <p>Aucune classe ne vous est encore attribuée.</p>
      ) : (
        <ul>
          {professeur.classes.map((classe) => (
            <li key={classe.id}>
              <strong>{classe.nom}</strong> — {classe._count.eleves} élève(s)
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 16, opacity: 0.6, fontSize: ".85rem" }}>
        Prochaines briques : émargement, cahier de texte, carnet de notes, annonces.
      </p>
    </main>
  );
}
