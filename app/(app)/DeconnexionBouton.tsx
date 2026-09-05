"use client";

import { signOut } from "next-auth/react";

export function DeconnexionBouton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-ghost"
      style={{ padding: "8px 16px", fontSize: ".88rem" }}
    >
      Déconnexion
    </button>
  );
}
