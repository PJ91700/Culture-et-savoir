import Link from "next/link";
import { getSession } from "@/lib/guard";
import { DeconnexionBouton } from "./DeconnexionBouton";
import type { Role } from "@prisma/client";

// En-tête commun à tous les espaces connectés.
const LIBELLE_ROLE: Record<Role, string> = {
  PARENT: "Espace parents",
  ELEVE: "Espace élève",
  PROFESSEUR: "Espace professeur",
  ADMIN: "Administration",
};

export async function EspaceHeader() {
  const session = await getSession();
  const role = session?.user.role;

  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Culture & Savoir" />
          <b>Culture &amp; Savoir</b>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {role && (
            <span
              style={{
                fontSize: ".85rem",
                fontWeight: 600,
                color: "var(--blue)",
                background: "rgba(28,107,163,.1)",
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              {LIBELLE_ROLE[role]}
            </span>
          )}
          <DeconnexionBouton />
        </div>
      </div>
    </header>
  );
}
