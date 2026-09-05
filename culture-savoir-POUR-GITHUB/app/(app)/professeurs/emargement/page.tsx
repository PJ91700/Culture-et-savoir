import { prisma } from "@/lib/db";
import { getSession } from "@/lib/guard";
import { enregistrerPresences } from "../actions";
import { FormulaireProf } from "../FormulaireProf";

// Feuille d'émargement. Le prof choisit une de ses classes, une date, puis
// coche présents / retards. Pensé pour un usage mobile ou tablette en classe.
export default async function EmargementPage({
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

  const aujourdhui = new Date().toISOString().slice(0, 10);

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Émargement</h1>

      {classes.length === 0 ? (
        <p>Aucune classe ne vous est attribuée.</p>
      ) : (
        <>
          <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {classes.map((c) => (
              <a
                key={c.id}
                href={`/professeurs/emargement?classe=${c.id}`}
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
            <FormulaireProf action={enregistrerPresences} libelleBouton="Enregistrer la feuille">
              <input type="hidden" name="classeId" value={classeActive.id} />
              <div style={{ marginBottom: 16 }}>
                <label>
                  Date :{" "}
                  <input type="date" name="date" defaultValue={aujourdhui} required />
                </label>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Élève</th>
                    <th style={th}>Présent</th>
                    <th style={th}>Retard</th>
                  </tr>
                </thead>
                <tbody>
                  {classeActive.eleves.map((e) => (
                    <tr key={e.id}>
                      <td style={td}>
                        {e.prenom} {e.nom}
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <input type="checkbox" name={`present_${e.id}`} defaultChecked />
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <input type="checkbox" name={`retard_${e.id}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {classeActive.eleves.length === 0 && (
                <p>Aucun élève dans cette classe pour le moment.</p>
              )}
            </FormulaireProf>
          )}
        </>
      )}
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "2px solid #ddd",
  fontSize: ".9rem",
};
const td: React.CSSProperties = { padding: "8px", borderBottom: "1px solid #eee" };
