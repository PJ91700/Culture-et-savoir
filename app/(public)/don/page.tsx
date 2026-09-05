// Page "Faire un don" : don ponctuel ou mensuel, via HelloAsso.
export default function DonPage() {
  return (
    <section className="band">
      <div className="wrap narrow">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="kicker" style={{ justifyContent: "center" }}>Soutenir l'école</span>
          <h1 className="title">Votre générosité fait grandir l'école</h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
            Chaque don finance le matériel pédagogique et aide les familles qui en ont besoin.
          </p>
        </div>
        <div className="donate">
          <div className="dcard">
            <h3>Don ponctuel</h3>
            <p>Un soutien libre, en une seule fois.</p>
            <button className="btn-primary" style={{ width: "auto" }}>Donner maintenant</button>
          </div>
          <div className="dcard">
            <h3>Don mensuel</h3>
            <p>Un prélèvement régulier, que vous pouvez arrêter à tout moment.</p>
            <button className="btn-primary" style={{ width: "auto" }}>Devenir donateur régulier</button>
          </div>
        </div>
        <p className="ph" style={{ textAlign: "center", fontSize: ".86rem", marginTop: 22 }}>
          Les dons seront gérés via HelloAsso, dès l'activation du compte de l'association.
        </p>
      </div>
    </section>
  );
}
