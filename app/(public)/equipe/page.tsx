// Page "Rejoindre l'équipe" : direction, postes à pourvoir, candidature spontanée.
export default function EquipePage() {
  return (
    <section className="band">
      <div className="wrap">
        <span className="kicker">Rejoindre l'équipe</span>
        <h1 className="title">Une équipe engagée pour vos enfants</h1>

        <div className="prose-block" style={{ borderTop: "none", paddingTop: 24 }}>
          <h3>La direction pédagogique</h3>
          <div className="people" style={{ marginTop: 20 }}>
            <div className="person">
              <div className="av">؟</div>
              <div className="ph">[Nom à venir]</div>
              <div className="pr">Directeur — école coranique</div>
            </div>
            <div className="person">
              <div className="av">؟</div>
              <div className="ph">[Nom à venir]</div>
              <div className="pr">Directrice — école arabe</div>
            </div>
          </div>
        </div>

        <div className="prose-block">
          <h3>Postes à pourvoir</h3>
          <div style={{ marginTop: 18 }}>
            <div className="job">
              <span className="ph">[Poste — ex. Professeur d'arabe]</span>
              <span className="jm">Temps partiel · à préciser</span>
            </div>
            <div className="job">
              <span className="ph">[Poste — ex. Professeur de Coran]</span>
              <span className="jm">Temps partiel · à préciser</span>
            </div>
          </div>
          <div className="callout" style={{ marginTop: 24 }}>
            <p>Vous partagez notre mission éducative ? Envoyez-nous une candidature spontanée.</p>
            <a className="btn-primary" href="mailto:recrutement@culture-savoir91.fr">Postuler par email</a>
            <p className="ph" style={{ fontSize: ".76rem", marginTop: 12, marginBottom: 0 }}>
              Adresse email d'exemple — à remplacer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
