import { CATALOGUE } from "@/lib/catalogue";

// Page de présentation de l'association, avec les classes réelles du catalogue.
export default function AssociationPage() {
  return (
    <>
      <section className="band">
        <div className="wrap">
          <span className="tag">Association loi 1901</span>
          <h1 className="title">L&apos;association Culture &amp; Savoir</h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 12, maxWidth: "60ch" }}>
            Une école de proximité dédiée à l&apos;excellence éducative et
            culturelle, au cœur de l&apos;Essonne.
          </p>

          <div className="ledger" style={{ marginTop: 28 }}>
            <div className="lrow"><span className="k">Dénomination</span><span className="v">CULTURE ET SAVOIR</span></div>
            <div className="lrow"><span className="k">Siège social</span><span className="v">44 av. Jacques Duclos, 91700 Sainte-Geneviève-des-Bois</span></div>
            <div className="lrow"><span className="k">Création</span><span className="v">15 / 09 / 2023</span></div>
            <div className="lrow"><span className="k">SIREN</span><span className="v">924 043 458</span></div>
          </div>
          <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", opacity: 0.7, marginTop: 8 }}>
            Source : Annuaire des Entreprises (data.gouv.fr)
          </p>

          <div style={{ marginTop: 36 }}>
            <div className="prose-block">
              <h3>Notre projet éducatif</h3>
              <p className="ph">
                [À compléter avec l&apos;association] Offrir à chaque élève une
                double excellence — la maîtrise de la langue arabe et une
                éducation coranique exigeante — dans un cadre structuré,
                bienveillant et respectueux du rythme de chacun.
              </p>
            </div>
            <div className="prose-block">
              <h3>Notre pédagogie</h3>
              <p className="ph">
                [À compléter] Une progression par niveaux, un suivi individualisé
                des présences et des résultats, et des outils numériques pour
                prolonger l&apos;apprentissage à la maison.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band warm">
        <div className="wrap">
          <span className="kicker">Nos enseignements</span>
          <h2 className="title" style={{ marginBottom: 28 }}>Nos classes</h2>
          <div style={{ display: "grid", gap: 20 }}>
            {CATALOGUE.map((pub) => (
              <div className="card" key={pub.code}>
                <h3 style={{ fontSize: "1.4rem", marginBottom: 6 }}>{pub.libelle}</h3>
                <p style={{ color: "var(--ink-soft)", marginBottom: 14 }}>{pub.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {pub.niveaux.map((n) => (
                    <span
                      key={n.code}
                      style={{
                        fontSize: ".85rem",
                        padding: "6px 14px",
                        borderRadius: 999,
                        background: "rgba(28,107,163,.08)",
                        color: "var(--blue)",
                        fontWeight: 500,
                      }}
                    >
                      {n.libelle}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
