import { prisma } from "@/lib/db";
import { creerCompteProfesseur } from "../actions";
import { FormulaireAction } from "../FormulaireAction";

type ProfesseurAvecInfos = {
  id: string;
  prenom: string;
  nom: string;
  utilisateur: { email: string };
  classes: { nom: string }[];
};

// Gestion des comptes professeurs.
export default async function GestionComptes() {
  const professeurs = (await prisma.professeur.findMany({
    orderBy: { nom: "asc" },
    include: {
      utilisateur: { select: { email: true } },
      classes: { select: { nom: true } },
    },
  })) as ProfesseurAvecInfos[];

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1>Comptes professeurs</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Créer un compte professeur</h2>
        <FormulaireAction action={creerCompteProfesseur} libelleBouton="Créer le compte">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
              maxWidth: 640,
            }}
          >
            <input name="prenom" placeholder="Prénom" required />
            <input name="nom" placeholder="Nom" required />
            <input name="email" type="email" placeholder="Email" required />
            <input
              name="motDePasse"
              type="password"
              placeholder="Mot de passe provisoire (8+ car.)"
              required
              minLength={8}
            />
          </div>
        </FormulaireAction>
        <p style={{ fontSize: ".85rem", opacity: 0.7, marginTop: 8 }}>
          Le professeur pourra changer son mot de passe à la première connexion.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Enseignants</h2>
        {professeurs.length === 0 ? (
          <p>Aucun professeur enregistré.</p>
        ) : (
          <ul>
            {professeurs.map((p) => (
              <li key={p.id}>
                <strong>
                  {p.prenom} {p.nom}
                </strong>{" "}
                — {p.utilisateur.email} —{" "}
                {p.classes.length > 0
                  ? p.classes.map((c) => c.nom).join(", ")
                  : "aucune classe"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
