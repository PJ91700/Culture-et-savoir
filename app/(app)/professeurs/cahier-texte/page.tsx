import { prisma } from "@/lib/db";
import { getSession } from "@/lib/guard";
import { ajouterCahierTexte } from "../actions";
import { FormulaireProf } from "../FormulaireProf";

// Cahier de texte : le prof saisit la leçon du jour et les devoirs pour une
// de ses classes, et voit l'historique récent.
export default async function CahierTextePage({
  searchParams,
}: {
  searchParams: { classe?: string };
}) {
  const session = await getSession();

  const professeur = (await prisma.professeur.findUnique({
    where: { utilisateurId: session!.user.id },
    include: { classes: { orderBy: { nom: "asc" }, select: { id: true, nom: true } } },
  })) as { classes: { id: string; nom: string }[] } | null;

  const classes = professeur?.classes ?? [];
  const classeActive =
    classes.find((c) => c.id === searchParams.classe) ?? classes[0];

  const entrees = classeActive
    ? ((await prisma.cahierTexte.findMany({
        where: { classeId: classeActive.id },
        orderBy: { date: "desc" },
        take: 10,
      })) as { id: string; date: Date; lecon: string; devoirs: string | null }[])
    : [];

  const aujourdhui = new Date().toISOString().slice(0, 10);

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Cahier de texte</h1>

      {classes.length === 0 ? (
        <p>Aucune classe ne vous est attribuée.</p>
      ) : (
        <>
          <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {classes.map((c) => (
              <a
                key={c.id}
                href={`/professeurs/cahier-texte?classe=${c.id}`}
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
            <>
              <FormulaireProf action={ajouterCahierTexte} libelleBouton="Ajouter au cahier">
                <input type="hidden" name="classeId" value={classeActive.id} />
                <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
                  <label>
                    Date
                    <input type="date" name="date" defaultValue={aujourdhui} required />
                  </label>
                  <label>
                    Leçon
                    <input name="lecon" placeholder="Contenu de la séance" required />
                  </label>
                  <label>
                    Devoirs (optionnel)
                    <input name="devoirs" placeholder="Travail à faire" />
                  </label>
                </div>
              </FormulaireProf>

              <h2 style={{ marginTop: 32 }}>Dernières entrées — {classeActive.nom}</h2>
              {entrees.length === 0 ? (
                <p>Aucune entrée pour l&apos;instant.</p>
              ) : (
                <ul>
                  {entrees.map((e) => (
                    <li key={e.id} style={{ marginBottom: 10 }}>
                      <strong>{new Date(e.date).toLocaleDateString("fr-FR")}</strong> —{" "}
                      {e.lecon}
                      {e.devoirs && (
                        <div style={{ fontSize: ".9rem", opacity: 0.75 }}>
                          Devoirs : {e.devoirs}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
