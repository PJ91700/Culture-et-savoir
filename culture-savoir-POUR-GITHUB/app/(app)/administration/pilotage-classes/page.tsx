import { prisma } from "@/lib/db";
import { calculerPlaces, libellePlaces } from "@/lib/places";
import {
  ControleCapacite,
  ControleOuverture,
  ControleTarif,
  ControleInscriptions,
  ControleAnnee,
} from "../ControlesPilotage";

type ClasseRow = {
  id: string;
  nom: string;
  capacite: number;
  ouverte: boolean;
  tarifCentimes: number | null;
  _count: { inscriptions: number };
};
type ReglagesRow = {
  anneeActive: string;
  inscriptionsOuvertes: boolean;
  messageInscription: string | null;
};

// Page unique de pilotage : l'admin gère ici capacité, ouverture, tarif de
// chaque classe, et les réglages globaux (période d'inscription, année).
export default async function PilotagePage() {
  const [classes, reglages] = await Promise.all([
    prisma.classe.findMany({
      orderBy: { nom: "asc" },
      include: { _count: { select: { inscriptions: true } } },
    }) as Promise<ClasseRow[]>,
    prisma.reglages.findUnique({ where: { id: "global" } }) as Promise<ReglagesRow | null>,
  ]);

  const inscriptionsOuvertes = reglages?.inscriptionsOuvertes ?? true;
  const anneeActive = reglages?.anneeActive ?? "2026-2027";

  return (
    <>
      <h1 className="title" style={{ fontSize: "1.9rem", marginBottom: 6 }}>Pilotage de l&apos;école</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
        Modifiez à tout moment les places, l&apos;ouverture et les tarifs. Les
        changements sont immédiats.
      </p>

      {/* Réglages globaux */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: 16 }}>Réglages généraux</h2>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Période d&apos;inscription :{" "}
            <span className={`pill ${inscriptionsOuvertes ? "ok" : "wait"}`}>
              {inscriptionsOuvertes ? "Ouverte" : "Fermée"}
            </span>
          </div>
          <ControleInscriptions ouvertes={inscriptionsOuvertes} message={reglages?.messageInscription ?? null} />
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Année scolaire active</div>
          <ControleAnnee annee={anneeActive} />
        </div>
      </div>

      {/* Tableau des classes */}
      <div className="card">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 16 }}>Classes</h2>
        {classes.length === 0 ? (
          <p>Aucune classe pour l&apos;instant. Créez-en depuis « Classes ».</p>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {classes.map((c) => {
              const places = calculerPlaces(c.capacite, c._count.inscriptions);
              return (
                <div key={c.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                    <strong style={{ fontSize: "1.05rem" }}>{c.nom}</strong>
                    <span className={`pill ${places.complete ? "wait" : "ok"}`}>
                      {c._count.inscriptions}/{c.capacite} · {libellePlaces(places)}
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: 10, fontSize: ".9rem" }}>
                    <LigneControle label="Places">
                      <ControleCapacite classeId={c.id} capacite={c.capacite} />
                    </LigneControle>
                    <LigneControle label="Inscriptions">
                      <ControleOuverture classeId={c.id} ouverte={c.ouverte} />
                    </LigneControle>
                    <LigneControle label="Tarif annuel">
                      <ControleTarif classeId={c.id} tarifCentimes={c.tarifCentimes} />
                    </LigneControle>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function LigneControle({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <span style={{ width: 110, color: "var(--ink-soft)", flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  );
}
