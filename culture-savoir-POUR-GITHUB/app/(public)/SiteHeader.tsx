"use client";

import { useState } from "react";
import Link from "next/link";

// En-tête du site vitrine. Navigation vers les pages publiques + accès connexion.
// Le menu passe en tiroir sur mobile.
export function SiteHeader() {
  const [ouvert, setOuvert] = useState(false);

  const liens = [
    { href: "/", libelle: "Accueil" },
    { href: "/association", libelle: "L'association" },
    { href: "/actualites", libelle: "Actualités" },
    { href: "/inscription", libelle: "Inscription" },
    { href: "/equipe", libelle: "Équipe" },
    { href: "/don", libelle: "Faire un don" },
    { href: "/contact", libelle: "Contact" },
  ];

  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Culture & Savoir" />
          <b>Culture &amp; Savoir</b>
        </Link>

        <nav className={`site-nav ${ouvert ? "open" : ""}`}>
          {liens.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOuvert(false)}>
              {l.libelle}
            </Link>
          ))}
        </nav>

        <div className="topbar-tools">
          <Link href="/connexion" className="btn-login-sm">
            Connexion
          </Link>
          <button
            className="burger"
            aria-label="Menu"
            onClick={() => setOuvert((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
