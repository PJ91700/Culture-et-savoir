import Link from "next/link";
import { ACTUALITES } from "@/lib/contenu";

// Liste de toutes les actualités.
export default function ActualitesPage() {
  return (
    <section className="band">
      <div className="wrap">
        <span className="kicker">Actualités</span>
        <h1 className="title" style={{ marginBottom: 36 }}>Toute l'actualité de l'école</h1>
        <div className="actu-grid">
          {ACTUALITES.map((a) => (
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
  );
}
