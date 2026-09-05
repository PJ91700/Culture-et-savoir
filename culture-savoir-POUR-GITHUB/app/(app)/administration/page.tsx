import { prisma } from "@/lib/db";

// Tableau de bord de l'administration.
// Affiche les effectifs et le suivi des cotisations directement depuis la base.
export default async function AdministrationAccueil() {
  // Quelques agrégats simples pour la vue d'ensemble.
  const [nbEleves, nbClasses, inscriptionsEnAttente, paiementsPayes] =
    await Promise.all([
      prisma.eleve.count(),
      prisma.classe.count(),
      prisma.inscription.count({ where: { statut: "EN_ATTENTE_PAIEMENT" } }),
      prisma.paiement.count({ where: { statut: "PAYE" } }),
    ]);

  const cartes = [
    { label: "Élèves inscrits", valeur: nbEleves },
    { label: "Classes ouvertes", valeur: nbClasses },
    { label: "Inscriptions en attente de paiement", valeur: inscriptionsEnAttente },
    { label: "Cotisations réglées", valeur: paiementsPayes },
  ];

  return (
    <main style={{ padding: 24 }}>
      <h1>Tableau de bord</h1>
      <p>Vue d&apos;ensemble de l&apos;école.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {cartes.map((c) => (
          <div
            key={c.label}
            style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>{c.valeur}</div>
            <div style={{ fontSize: ".9rem", opacity: 0.7 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/administration/pilotage-classes" className="btn-primary" style={{ textDecoration: "none" }}>
          Piloter les classes, places et tarifs
        </a>
        <a href="/administration/classes" className="btn-ghost" style={{ textDecoration: "none" }}>
          Créer des classes
        </a>
        <a href="/administration/comptes" className="btn-ghost" style={{ textDecoration: "none" }}>
          Comptes professeurs
        </a>
      </div>
    </main>
  );
}
