import Link from "next/link";
import { STATS, VALEURS, ACTUALITES, TEMOIGNAGES } from "@/lib/contenu";

// Page d'accueil enrichie : hero, statistiques, ambition, valeurs, histoire,
// actualités, témoignages, et appel à l'inscription.
export default function AccueilPage() {
  const profils = [
    { idx: "01", titre: "Parents", desc: "Inscription, paiement, présences, bulletins et messagerie avec l'école." },
    { idx: "02", titre: "Élèves", desc: "Cours d'arabe et de Coran, exercices interactifs, quiz et emploi du temps." },
    { idx: "03", titre: "Professeurs", desc: "Émargement, cahier de texte, carnet de notes et annonces aux familles." },
    { idx: "04", titre: "Administration", desc: "Effectifs, classes, suivi des cotisations et relances automatiques." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero-home">
        <div className="wrap hero-home-in">
          <div className="fade-up">
            <span className="kicker">Sainte-Geneviève-des-Bois · Essonne</span>
            <h1 className="hero-h1">
              Offrons à nos enfants un avenir ancré dans <span className="accent">la foi et le savoir</span>
            </h1>
            <p className="hero-lead">
              École arabe et coranique de l'association Culture &amp; Savoir :
              transmettre la langue arabe et le Coran, avec exigence et
              bienveillance, de l'enfance à l'âge adulte.
            </p>
            <div className="hero-cta">
              <Link href="/inscription" className="btn-primary">Je m'inscris</Link>
              <Link href="/don" className="btn-ghost">Je fais un don</Link>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-halo" />
            <svg className="hero-khatam" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M50 2 L61 39 L98 50 L61 61 L50 98 L39 61 L2 50 L39 39 Z" />
              <circle cx="50" cy="50" r="30" />
              <circle cx="50" cy="50" r="46" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-logo" src="/logo.png" alt="" />
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="stats-band">
        <div className="wrap stats-row">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-n">{s.valeur}</div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AMBITION + VALEURS */}
      <section className="band">
        <div className="wrap">
          <div className="section-head-center">
            <span className="kicker">Notre ambition</span>
            <h2 className="title">Une éducation qui élève, une culture qui enracine</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: 14 }}>
              Transmettre à chaque élève la maîtrise de la langue arabe et une
              éducation coranique exigeante, dans un cadre structuré et
              bienveillant qui respecte le rythme de chacun.
            </p>
          </div>
          <div className="values">
            {VALEURS.map((v) => (
              <div className="value" key={v.titre}>
                <div className="value-mark" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><path d="M20 3 L24 15 L37 20 L24 25 L20 37 L16 25 L3 20 L16 15 Z" /></svg>
                </div>
                <h3>{v.titre}</h3>
                <p>{v.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="band warm">
        <div className="wrap histoire">
          <div className="histoire-img" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" />
          </div>
          <div>
            <span className="kicker">Notre histoire</span>
            <h2 className="title" style={{ marginBottom: 16 }}>Une association née d'une volonté de transmettre</h2>
            <p className="ph" style={{ marginBottom: 12 }}>
              [À compléter avec l'association] Fondée en 2023 à
              Sainte-Geneviève-des-Bois, l'association Culture &amp; Savoir est
              née de la volonté de parents de proposer un enseignement de l'arabe
              et du Coran de qualité, accessible et bienveillant.
            </p>
            <p className="ph" style={{ marginBottom: 20 }}>
              [À compléter] Aujourd'hui, l'école accueille enfants, adolescents et
              femmes adultes, répartis sur sept niveaux, avec une même exigence de
              sérieux et de soin.
            </p>
            <Link href="/association" className="btn-ghost">Découvrir l'association</Link>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="band">
        <div className="wrap">
          <div className="actu-head">
            <div>
              <span className="kicker">Actualités</span>
              <h2 className="title">Les dernières nouvelles de l'école</h2>
            </div>
            <Link href="/actualites" className="btn-ghost">Toutes les actualités</Link>
          </div>
          <div className="actu-grid">
            {ACTUALITES.slice(0, 3).map((a) => (
              <Link href={`/actualites/${a.slug}`} className="actu-card" key={a.slug}>
                <span className="actu-cat">{a.categorie}</span>
                <h3>{a.titre}</h3>
                <time>{a.date}</time>
                <p>{a.extrait}</p>
                <span className="go">Lire la suite →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ESPACES (4 profils) */}
      <section className="band warm">
        <div className="wrap">
          <div className="section-head-center">
            <span className="kicker">Une plateforme, quatre espaces</span>
            <h2 className="title">Chacun trouve exactement ce qui le concerne</h2>
          </div>
          <div className="pillars">
            {profils.map((p) => (
              <div className="pillar" key={p.idx}>
                <span className="pillar-idx">{p.idx}</span>
                <h3>{p.titre}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="band">
        <div className="wrap">
          <div className="section-head-center">
            <span className="kicker">Témoignages</span>
            <h2 className="title">Ils nous font confiance</h2>
          </div>
          <div className="temoignages">
            {TEMOIGNAGES.map((t, i) => (
              <figure className="temoignage" key={i}>
                <div className="quote-mark" aria-hidden="true">”</div>
                <blockquote>{t.texte}</blockquote>
                <figcaption>{t.auteur}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* APPEL FINAL */}
      <section className="cta-final">
        <div className="wrap cta-final-in">
          <h2 className="title" style={{ color: "#fff" }}>Rejoignez l'école Culture &amp; Savoir</h2>
          <p>Les inscriptions pour l'année 2026-2027 sont ouvertes.</p>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link href="/inscription" className="btn-primary">Inscrire mon enfant</Link>
            <Link href="/don" className="btn-ghost btn-ghost-light">Soutenir l'école</Link>
          </div>
        </div>
      </section>
    </>
  );
}
