import Link from "next/link";
import { notFound } from "next/navigation";
import { ACTUALITES } from "@/lib/contenu";

// Page de détail d'une actualité.
export function generateStaticParams() {
  return ACTUALITES.map((a) => ({ slug: a.slug }));
}

export default function ActualiteDetail({ params }: { params: { slug: string } }) {
  const actu = ACTUALITES.find((a) => a.slug === params.slug);
  if (!actu) notFound();

  return (
    <section className="band">
      <div className="wrap narrow">
        <Link href="/actualites" className="btn-ghost" style={{ marginBottom: 24 }}>
          ← Toutes les actualités
        </Link>
        <span className="actu-cat" style={{ marginTop: 20 }}>{actu.categorie}</span>
        <h1 className="title" style={{ margin: "12px 0 6px" }}>{actu.titre}</h1>
        <time style={{ color: "var(--gold)", fontWeight: 600, fontSize: ".9rem" }}>{actu.date}</time>
        <div style={{ marginTop: 24 }}>
          {actu.corps.map((p, i) => (
            <p key={i} className="ph" style={{ color: "var(--ink-soft)", marginBottom: 14, maxWidth: "68ch" }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
