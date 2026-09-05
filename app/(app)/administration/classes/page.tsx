import { prisma } from "@/lib/db";
import { creerClasse, creerMatiere, creerClasseDepuisCatalogue } from "../actions";
import { FormulaireAction } from "../FormulaireAction";
import { tousLesNiveaux } from "@/lib/catalogue";

type ClasseAvecInfos = {
  id: string;
  nom: string;
  niveau: string;
  ageMin: number | null;
  ageMax: number | null;
  professeurs: { id: string }[];
  _count: { eleves: number };
};
type Matiere = { id: string; nom: string };

// Gestion des classes et des matières.
export default async function GestionClasses() {
  const [classes, matieres] = (await Promise.all([
    prisma.classe.findMany({
      orderBy: { nom: "asc" },
      include: { professeurs: true, _count: { select: { eleves: true } } },
    }),
    prisma.matiere.findMany({ orderBy: { nom: "asc" } }),
  ])) as [ClasseAvecInfos[], Matiere[]];

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1>Classes et matières</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Ouvrir une classe (catalogue de l&apos;école)</h2>
        <p style={{ fontSize: ".9rem", opacity: 0.75, marginBottom: 12 }}>
          Choisissez un niveau du catalogue et, si besoin, un groupe (A, B…)
          lorsqu&apos;il y a plusieurs classes sur le même niveau.
        </p>
        <FormulaireAction
          action={creerClasseDepuisCatalogue}
          libelleBouton="Ouvrir la classe"
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select name="niveauCode" required style={{ flex: 1, minWidth: 260 }}>
              {tousLesNiveaux().map((n) => (
                <option key={n.codeNiveau} value={n.codeNiveau}>
                  {n.libelleComplet}
                </option>
              ))}
            </select>
            <input name="groupe" placeholder="Groupe (optionnel : A, B…)" style={{ width: 200 }} />
          </div>
        </FormulaireAction>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Créer une classe libre</h2>
        <FormulaireAction action={creerClasse} libelleBouton="Créer la classe">
          <div style={grille}>
            <input name="nom" placeholder="Nom (ex : Coran — Niveau 1)" required />
            <input name="niveau" placeholder="Niveau (ex : Coran 1)" required />
            <input name="ageMin" type="number" placeholder="Âge min (optionnel)" min={0} max={99} />
            <input name="ageMax" type="number" placeholder="Âge max (optionnel)" min={0} max={99} />
            <input name="niveauRequis" placeholder="Prérequis (optionnel)" />
          </div>
        </FormulaireAction>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Classes existantes</h2>
        {classes.length === 0 ? (
          <p>Aucune classe pour l&apos;instant.</p>
        ) : (
          <ul>
            {classes.map((c) => (
              <li key={c.id}>
                <strong>{c.nom}</strong> — niveau {c.niveau}
                {c.ageMin !== null || c.ageMax !== null
                  ? ` — âge ${c.ageMin ?? "?"}–${c.ageMax ?? "?"}`
                  : ""}
                {" — "}
                {c._count.eleves} élève(s), {c.professeurs.length} professeur(s)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Matières</h2>
        <FormulaireAction action={creerMatiere} libelleBouton="Ajouter">
          <input name="nom" placeholder="Nom (ex : Arabe, Coran, Tajwid)" required />
        </FormulaireAction>
        <ul style={{ marginTop: 12 }}>
          {matieres.map((m) => (
            <li key={m.id}>{m.nom}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const grille: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
  maxWidth: 640,
};
