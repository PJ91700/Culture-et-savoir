import type { Resultat } from "./index";

// Validations propres au travail du professeur : émargement et notes.
// Pures et testables, sans dépendance à Prisma.

// --- Note sur 20 ---
// On impose une note comprise entre 0 et 20, avec au plus 2 décimales.
export function validerNote(brut: string | number): Resultat<number> {
  const n = typeof brut === "number" ? brut : Number(String(brut).replace(",", "."));
  if (!Number.isFinite(n)) {
    return { ok: false, erreur: "La note doit être un nombre." };
  }
  if (n < 0 || n > 20) {
    return { ok: false, erreur: "La note doit être comprise entre 0 et 20." };
  }
  // Arrondi à 2 décimales pour éviter les 13.333333
  const arrondie = Math.round(n * 100) / 100;
  return { ok: true, valeur: arrondie };
}

// --- Trimestre ---
export function validerTrimestre(brut: string | number): Resultat<number> {
  const n = typeof brut === "number" ? brut : Number(brut);
  if (![1, 2, 3].includes(n)) {
    return { ok: false, erreur: "Le trimestre doit être 1, 2 ou 3." };
  }
  return { ok: true, valeur: n };
}

// --- Une saisie de présence pour un élève ---
export type SaisiePresence = {
  eleveId: string;
  present: boolean;
  retard: boolean;
};

// Règle métier : un élève absent ne peut pas être « en retard » en même temps.
// (le retard n'a de sens que si l'élève est présent)
export function validerPresence(saisie: SaisiePresence): Resultat<SaisiePresence> {
  if (!saisie.eleveId) {
    return { ok: false, erreur: "Élève manquant dans la saisie de présence." };
  }
  if (!saisie.present && saisie.retard) {
    return {
      ok: false,
      erreur: "Un élève absent ne peut pas être marqué en retard.",
    };
  }
  return { ok: true, valeur: saisie };
}

// --- Valider une feuille d'émargement complète ---
// Vérifie chaque ligne ; renvoie la première erreur rencontrée, sinon la liste validée.
export function validerFeuillePresence(
  saisies: SaisiePresence[]
): Resultat<SaisiePresence[]> {
  if (saisies.length === 0) {
    return { ok: false, erreur: "Aucune présence à enregistrer." };
  }
  // Détecter les doublons d'élève (un élève ne doit apparaître qu'une fois)
  const vus = new Set<string>();
  for (const s of saisies) {
    if (vus.has(s.eleveId)) {
      return { ok: false, erreur: "Un élève apparaît deux fois dans la feuille." };
    }
    vus.add(s.eleveId);

    const ligne = validerPresence(s);
    if (ligne.ok === false) return { ok: false, erreur: ligne.erreur };
  }
  return { ok: true, valeur: saisies };
}
