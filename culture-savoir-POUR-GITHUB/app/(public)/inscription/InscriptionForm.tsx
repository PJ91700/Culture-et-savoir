"use client";

import { useState } from "react";
import { CATALOGUE, trouverNiveau, type CreneauCatalogue } from "@/lib/catalogue";

// Parcours d'inscription en 4 étapes, fidèle au fonctionnement réel de l'école :
//   1. Parent (père, mère, contacts)
//   2. Enfant + filière + niveau + créneau (selon places)
//   3. Documents (dont attestation d'assurance)
//   4. Paiement (annuel, non remboursable)
//
// Version MVP : collecte et présentation. La soumission réelle (dossier +
// paiement HelloAsso + décompte des places) sera branchée sur une Server Action.

const ETAPES = ["Parent", "Enfant & cours", "Documents", "Paiement"];

export function InscriptionForm() {
  const [etape, setEtape] = useState(0);
  const [filiereCode, setFiliereCode] = useState(CATALOGUE[0].code);
  const [niveauCode, setNiveauCode] = useState(CATALOGUE[0].niveaux[0].code);

  const filiere = CATALOGUE.find((f) => f.code === filiereCode) ?? CATALOGUE[0];
  const creneaux: CreneauCatalogue[] = trouverNiveau(niveauCode)?.niveau.creneaux ?? [];

  function changerFiliere(code: string) {
    setFiliereCode(code);
    const f = CATALOGUE.find((x) => x.code === code);
    if (f) setNiveauCode(f.niveaux[0].code); // repositionne sur le 1er niveau
  }

  const suivant = () => setEtape((e) => Math.min(ETAPES.length - 1, e + 1));
  const precedent = () => setEtape((e) => Math.max(0, e - 1));

  return (
    <div className="card">
      <div className="steps">
        <div className="steps-line" />
        <div className="steps-progress" style={{ width: `${(etape / (ETAPES.length - 1)) * 100}%` }} />
        {ETAPES.map((label, i) => (
          <div className={`stp ${i === etape ? "on" : ""} ${i < etape ? "done" : ""}`} key={label}>
            <div className="dot">{i + 1}</div>
            <div className="sl">{label}</div>
          </div>
        ))}
      </div>

      {/* Étape 1 — Parent */}
      {etape === 0 && (
        <div className="fade-up">
          <div className="field-group">
            <label>Nom et prénom du père<input type="text" /></label>
            <label>Nom et prénom de la mère<input type="text" /></label>
            <label>Adresse email<input type="email" /></label>
            <label>Téléphone du parent référent<input type="tel" /></label>
            <label>Téléphone d&apos;urgence (autre personne)<input type="tel" /></label>
            <label>Adresse postale<input type="text" /></label>
            <label>Ville<input type="text" /></label>
          </div>
          <p style={{ fontSize: ".82rem", color: "var(--ink-soft)", marginTop: 12 }}>
            Vous pourrez inscrire plusieurs enfants dans le même dossier.
          </p>
        </div>
      )}

      {/* Étape 2 — Enfant + cours */}
      {etape === 1 && (
        <div className="fade-up">
          <div className="field-group">
            <label>Nom de l&apos;enfant<input type="text" /></label>
            <label>Prénom de l&apos;enfant<input type="text" /></label>
            <label>
              Sexe
              <select><option>Un garçon</option><option>Une fille</option></select>
            </label>
            <label>Date de naissance<input type="date" /></label>
            <label>Classe à l&apos;école publique<input type="text" placeholder="ex : CE2, 6ème…" /></label>

            <label>
              Type de cours
              <select value={filiereCode} onChange={(e) => changerFiliere(e.target.value)}>
                {CATALOGUE.map((f) => (
                  <option key={f.code} value={f.code}>{f.libelle}</option>
                ))}
              </select>
            </label>
            <label>
              Niveau
              <select value={niveauCode} onChange={(e) => setNiveauCode(e.target.value)}>
                {filiere.niveaux.map((n) => (
                  <option key={n.code} value={n.code}>{n.libelle}</option>
                ))}
              </select>
            </label>
            <label>
              Créneau souhaité
              <select>
                {creneaux.map((c) => (
                  <option key={c.code} value={c.code}>{c.libelle}</option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ marginTop: 16, padding: 14, background: "var(--paper-warm)", borderRadius: 11, fontSize: ".88rem" }}>
            <strong>Santé</strong>
            <label style={{ marginTop: 8 }}>
              L&apos;enfant présente-t-il des problèmes de santé ?
              <select><option>Non</option><option>Oui</option></select>
            </label>
            <label style={{ marginTop: 8 }}>
              Est-il suivi par un médecin ?
              <select><option>Non</option><option>Oui</option></select>
            </label>
          </div>
          <p className="ph" style={{ fontSize: ".8rem", marginTop: 10 }}>
            Les créneaux affichés dépendront des places réellement disponibles.
          </p>
        </div>
      )}

      {/* Étape 3 — Documents */}
      {etape === 2 && (
        <div className="fade-up">
          <div className="doc">
            <span>Attestation d&apos;assurance (obligatoire)</span>
            <span className="pill wait">Requis</span>
          </div>
          <div className="doc">
            <span>Attestation d&apos;engagement et de présence</span>
            <span className="pill wait">Requis</span>
          </div>
          <p className="ph" style={{ fontSize: ".82rem", marginTop: 10 }}>
            Le dépôt de fichiers sera activé une fois le stockage sécurisé branché.
          </p>
        </div>
      )}

      {/* Étape 4 — Paiement */}
      {etape === 3 && (
        <div className="fade-up" style={{ textAlign: "center", padding: "10px 0" }}>
          <p style={{ color: "var(--ink-soft)" }}>
            Le paiement de la cotisation s&apos;effectue via HelloAsso.
          </p>
          <p style={{ color: "var(--ink-soft)", marginTop: 10, fontSize: ".9rem" }}>
            <strong>Important :</strong> le paiement est annuel, réglé en début
            d&apos;année, définitif et non remboursable en cas d&apos;interruption
            des cours par l&apos;élève.
          </p>
          <p style={{ marginTop: 12, fontWeight: 600 }}>
            L&apos;inscription est validée automatiquement dès confirmation du paiement.
          </p>
        </div>
      )}

      <div className="steps-nav">
        <button className="btn-ghost" onClick={precedent} style={{ visibility: etape === 0 ? "hidden" : "visible" }}>
          Retour
        </button>
        {etape < ETAPES.length - 1 ? (
          <button className="btn-primary" onClick={suivant}>Continuer</button>
        ) : (
          <button className="btn-primary">Valider et payer</button>
        )}
      </div>
    </div>
  );
}
