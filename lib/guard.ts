import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import type { Role } from "@prisma/client";

// Chaque espace de l'application correspond à un rôle et à une route de base.
export const ACCUEIL_PAR_ROLE: Record<Role, string> = {
  PARENT: "/parents",
  ELEVE: "/eleves",
  PROFESSEUR: "/professeurs",
  ADMIN: "/administration",
};

// À appeler en haut d'une page ou d'un layout serveur pour exiger une session.
// Si l'utilisateur n'est pas connecté -> redirection vers la connexion.
// Si son rôle n'est pas autorisé ici -> redirection vers SON espace à lui.
//
// Exemple d'usage dans app/(app)/administration/layout.tsx :
//   await exigerRole(["ADMIN"]);
export async function exigerRole(rolesAutorises: Role[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/connexion");
  }

  if (!rolesAutorises.includes(session.user.role)) {
    // L'utilisateur est connecté mais au mauvais endroit :
    // on le renvoie vers l'espace qui correspond à son rôle.
    redirect(ACCUEIL_PAR_ROLE[session.user.role]);
  }

  return session;
}

// Variante simple : récupérer la session sans imposer de rôle.
export async function getSession() {
  return getServerSession(authOptions);
}
