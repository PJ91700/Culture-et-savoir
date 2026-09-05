"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import type { ActionState } from "./actions";

// Formulaire réutilisable branché sur une Server Action à état.
// Affiche le message de succès/erreur renvoyé par l'action, et réinitialise
// les champs après un succès.

const ETAT_INITIAL: ActionState = { ok: false, message: "" };

function Bouton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? "Enregistrement…" : children}
    </button>
  );
}

export function FormulaireAction({
  action,
  libelleBouton,
  children,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  libelleBouton: string;
  children: React.ReactNode;
}) {
  const [etat, formAction] = useFormState(action, ETAT_INITIAL);

  return (
    <form action={formAction}>
      {children}
      <Bouton>{libelleBouton}</Bouton>
      {etat.message && (
        <p
          role={etat.ok ? "status" : "alert"}
          style={{
            marginTop: 10,
            color: etat.ok ? "#166534" : "#b91c1c",
            fontSize: ".9rem",
          }}
        >
          {etat.message}
        </p>
      )}
    </form>
  );
}
