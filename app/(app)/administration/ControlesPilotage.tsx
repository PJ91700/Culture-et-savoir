"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import {
  modifierCapacite,
  basculerOuvertureClasse,
  modifierTarif,
  basculerInscriptions,
  definirAnneeActive,
  type ActionState,
} from "./pilotage";

const INIT: ActionState = { ok: false, message: "" };

function Msg({ etat }: { etat: ActionState }) {
  if (!etat.message) return null;
  return (
    <span
      style={{
        fontSize: ".8rem",
        marginInlineStart: 10,
        color: etat.ok ? "var(--green)" : "var(--red)",
      }}
    >
      {etat.message}
    </span>
  );
}

function MiniBouton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "8px 14px",
        borderRadius: 9,
        border: "none",
        background: "var(--blue)",
        color: "#fff",
        fontSize: ".85rem",
        fontWeight: 600,
        cursor: "pointer",
        width: "auto",
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}

// Champ capacité modifiable
export function ControleCapacite({ classeId, capacite }: { classeId: string; capacite: number }) {
  const [etat, action] = useFormState(modifierCapacite, INIT);
  return (
    <form action={action} style={rowStyle}>
      <input type="hidden" name="classeId" value={classeId} />
      <input
        type="number"
        name="capacite"
        defaultValue={capacite}
        min={1}
        max={200}
        style={{ width: 80, padding: "8px 10px" }}
        aria-label="Capacité"
      />
      <MiniBouton>Enregistrer</MiniBouton>
      <Msg etat={etat} />
    </form>
  );
}

// Bouton ouvrir/fermer
export function ControleOuverture({ classeId, ouverte }: { classeId: string; ouverte: boolean }) {
  const [etat, action] = useFormState(basculerOuvertureClasse, INIT);
  return (
    <form action={action} style={rowStyle}>
      <input type="hidden" name="classeId" value={classeId} />
      <input type="hidden" name="ouverte" value={ouverte ? "false" : "true"} />
      <button
        type="submit"
        style={{
          padding: "8px 14px",
          borderRadius: 9,
          border: "1px solid var(--line-strong)",
          background: ouverte ? "var(--green-bg)" : "var(--red-bg)",
          color: ouverte ? "var(--green)" : "var(--red)",
          fontSize: ".85rem",
          fontWeight: 600,
          cursor: "pointer",
          width: "auto",
        }}
      >
        {ouverte ? "● Ouverte — cliquer pour fermer" : "○ Fermée — cliquer pour ouvrir"}
      </button>
      <Msg etat={etat} />
    </form>
  );
}

// Champ tarif modifiable (en euros)
export function ControleTarif({ classeId, tarifCentimes }: { classeId: string; tarifCentimes: number | null }) {
  const [etat, action] = useFormState(modifierTarif, INIT);
  return (
    <form action={action} style={rowStyle}>
      <input type="hidden" name="classeId" value={classeId} />
      <input
        type="text"
        name="tarif"
        defaultValue={tarifCentimes != null ? (tarifCentimes / 100).toFixed(2) : ""}
        placeholder="ex : 250"
        inputMode="decimal"
        style={{ width: 90, padding: "8px 10px" }}
        aria-label="Tarif en euros"
      />
      <span style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>€</span>
      <MiniBouton>Enregistrer</MiniBouton>
      <Msg etat={etat} />
    </form>
  );
}

// Réglages globaux : ouvrir/fermer les inscriptions
export function ControleInscriptions({
  ouvertes,
  message,
}: {
  ouvertes: boolean;
  message: string | null;
}) {
  const [etat, action] = useFormState(basculerInscriptions, INIT);
  return (
    <form action={action} style={{ display: "grid", gap: 10, maxWidth: 480 }}>
      <input type="hidden" name="ouvertes" value={ouvertes ? "false" : "true"} />
      <label>
        Message affiché sur la page d&apos;inscription (optionnel)
        <input type="text" name="message" defaultValue={message ?? ""} placeholder="ex : Ouverture des inscriptions le 1er septembre" />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="submit"
          className="btn-primary"
          style={{ width: "auto", background: ouvertes ? "var(--red)" : undefined }}
        >
          {ouvertes ? "Fermer les inscriptions" : "Ouvrir les inscriptions"}
        </button>
        <Msg etat={etat} />
      </div>
    </form>
  );
}

// Réglages globaux : année active
export function ControleAnnee({ annee }: { annee: string }) {
  const [etat, action] = useFormState(definirAnneeActive, INIT);
  return (
    <form action={action} style={rowStyle}>
      <input type="text" name="annee" defaultValue={annee} placeholder="2026-2027" style={{ width: 130, padding: "8px 10px" }} />
      <MiniBouton>Définir</MiniBouton>
      <Msg etat={etat} />
    </form>
  );
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};
