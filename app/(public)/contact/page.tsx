// Page Contact : bureau de l'association et bénévoles.
export default function ContactPage() {
  return (
    <section className="band">
      <div className="wrap">
        <span className="kicker">Nous contacter</span>
        <h1 className="title">Le bureau de l'association</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
          44 av. Jacques Duclos, 91700 Sainte-Geneviève-des-Bois
        </p>

        <div className="people" style={{ marginTop: 32, marginBottom: 40 }}>
          <div className="person"><div className="av">P</div><div className="pr">Président</div><div className="pi ph">[nom · email · téléphone]</div></div>
          <div className="person"><div className="av">S</div><div className="pr">Secrétaire</div><div className="pi ph">[nom · email · téléphone]</div></div>
          <div className="person"><div className="av">T</div><div className="pr">Trésorier</div><div className="pi ph">[nom · email · téléphone]</div></div>
        </div>

        <h2 className="title" style={{ fontSize: "1.5rem", marginBottom: 20 }}>Nos bénévoles</h2>
        <div className="people">
          <div className="person"><div className="av">١</div><div className="pr">Bénévole</div><div className="pi ph">[nom · rôle]</div></div>
          <div className="person"><div className="av">٢</div><div className="pr">Bénévole</div><div className="pi ph">[nom · rôle]</div></div>
          <div className="person"><div className="av">٣</div><div className="pr">Bénévole</div><div className="pi ph">[nom · rôle]</div></div>
        </div>
        <p className="ph" style={{ fontSize: ".8rem", marginTop: 20 }}>
          Toutes les coordonnées ci-dessus sont des exemples, à remplacer par les vraies informations.
        </p>
      </div>
    </section>
  );
}
