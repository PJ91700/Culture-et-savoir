import { prisma } from "@/lib/db";
import { getSession } from "@/lib/guard";
import { saisirNote } from "../actions";
import { FormulaireProf } from "../FormulaireProf";

// Carnet de notes : le prof choisit une classe, puis saisit une note (sur 20)
// pour un élève, dans une matière et un trimestre, avec une appréciation.
export default async function NotesPage({
  searchParams,
}: {
  searchParams: { classe?: string };
}) {
  const session = await getSession();

  const professeur = (await prisma.professeur.findUnique({
    where: { utilisateurId: session!.user.id },
    include: {
      classes: {
        orderBy: { nom: "asc" },
        include: {
          eleves: { orderBy: { nom: "asc" }, select: { id: true, prenom: true, nom: true } },
        },
      },
    },
  })) as {
    classes: {
      id: string;
      nom: string;
      eleves: { id: string; prenom: string; nom: string }[];
    }[];
  } | null;

  const classes = professeur?.classes ?? [];
  const classeActive =
    classes.find((c) => c.id === searchParams.classe) ?? classes[0];

  // Liste des matières disponibles (créées par l'admin).
  const matieres = (await prisma.matiere.findMany({
    orderBy: { nom: "asc" },
  })) as { id: string; nom: string }[];

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Carnet de notes</h1>

      {classes.length === 0 ? (
        <p>Aucune classe ne vous est attribuée.</p>
      ) : matieres.length === 0 ? (
        <p>
          Aucune matière n&apos;a encore été créée par l&apos;administration.
        </p>
      ) : (
        <>
          <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {classes.map((c) => (
              <a
                key={c.id}
                href={`/professeurs/notes?classe=${c.id}`}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid #ccc",
                  fontWeight: c.id === classeActive?.id ? 700 : 400,
                }}
              >
                {c.nom}
              </a>
            ))}
          </nav>

          {classeActive && (
            <FormulaireProf action={saisirNote} libelleBouton="Enregistrer la note">
              <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
                <label>
                  Élève
                  <select name="eleveId" required>
                    {classeActive.eleves.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.prenom} {e.nom}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Matière
                  <select name="matiereId" required>
                    {matieres.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nom}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Note (sur 20)
                  <input name="valeur" type="text" inputMode="decimal" placeholder="ex : 15,5" required />
                </label>
                <label>
                  Trimestre
                  <select name="trimestre" required>
                    <option value="1">1er trimestre</option>
                    <option value="2">2e trimestre</option>
                    <option value="3">3e trimestre</option>
                  </select>
                </label>
                <label>
                  Appréciation (optionnel)
                  <input name="appreciation" placeholder="Commentaire" />
                </label>
              </div>
            </FormulaireProf>
          )}
        </>
      )}
    </main>
  );
}
