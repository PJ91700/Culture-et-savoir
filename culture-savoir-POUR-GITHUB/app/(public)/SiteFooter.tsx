import Link from "next/link";

// Pied de page commun à toutes les pages publiques.
export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" />
              <b>Culture &amp; Savoir</b>
            </div>
            <p className="footer-desc">
              École arabe et coranique à Sainte-Geneviève-des-Bois, au service
              de l&apos;excellence éducative et culturelle.
            </p>
          </div>

          <div className="footer-col">
            <h5>Naviguer</h5>
            <Link href="/association">L&apos;association</Link>
            <Link href="/actualites">Actualités</Link>
            <Link href="/inscription">Inscription</Link>
            <Link href="/equipe">Rejoindre l&apos;équipe</Link>
            <Link href="/don">Faire un don</Link>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <Link href="/contact">Le bureau</Link>
            <span>44 av. Jacques Duclos</span>
            <span>91700 Sainte-Geneviève-des-Bois</span>
            <span>contact@culture-savoir91.fr</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Culture &amp; Savoir · SIREN 924 043 458</span>
          <span className="ph">Email d&apos;exemple — à remplacer</span>
        </div>
      </div>
    </footer>
  );
}
