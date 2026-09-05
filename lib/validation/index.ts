// Validation métier « pure » : aucune dépendance à Prisma ni au réseau.
// Ces fonctions sont testables unitairement et réutilisées par les Server Actions.
// Chacune renvoie soit { ok: true, valeur } soit { ok: false, erreur }.

export type Resultat<T> =
  | { ok: true; valeur: T }
  | { ok: false; erreur: string };

// --- Email ---
export function validerEmail(brut: string): Resultat<string> {
  const email = brut.trim().toLowerCase();
  if (email.length === 0) return { ok: false, erreur: "L'email est requis." };
  // Validation volontairement simple et robuste (pas de regex exotique).
  const forme = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!forme.test(email)) return { ok: false, erreur: "Format d'email invalide." };
  return { ok: true, valeur: email };
}

// --- Mot de passe ---
export function validerMotDePasse(mdp: string): Resultat<string> {
  if (mdp.length < 8) {
    return { ok: false, erreur: "Le mot de passe doit faire au moins 8 caractères." };
  }
  return { ok: true, valeur: mdp };
}

// --- Nom / libellé non vide ---
export function validerTexteRequis(brut: string, champ: string): Resultat<string> {
  const v = brut.trim();
  if (v.length === 0) return { ok: false, erreur: `${champ} est requis.` };
  return { ok: true, valeur: v };
}

// --- Critères d'âge d'une classe ---
// ageMin/ageMax optionnels ; si les deux sont fournis, min <= max.
export function validerTrancheAge(
  ageMin: number | null,
  ageMax: number | null
): Resultat<{ ageMin: number | null; ageMax: number | null }> {
  for (const [v, nom] of [
    [ageMin, "âge minimum"],
    [ageMax, "âge maximum"],
  ] as const) {
    if (v !== null && (!Number.isInteger(v) || v < 0 || v > 99)) {
      return { ok: false, erreur: `L'${nom} doit être un entier entre 0 et 99.` };
    }
  }
  if (ageMin !== null && ageMax !== null && ageMin > ageMax) {
    return { ok: false, erreur: "L'âge minimum ne peut pas dépasser l'âge maximum." };
  }
  return { ok: true, valeur: { ageMin, ageMax } };
}

// --- Année scolaire au format AAAA-AAAA (années consécutives) ---
export function validerAnneeScolaire(brut: string): Resultat<string> {
  const v = brut.trim();
  const m = v.match(/^(\d{4})-(\d{4})$/);
  if (!m) {
    return { ok: false, erreur: "L'année scolaire doit être au format AAAA-AAAA." };
  }
  const debut = Number(m[1]);
  const fin = Number(m[2]);
  if (fin !== debut + 1) {
    return { ok: false, erreur: "L'année scolaire doit couvrir deux années consécutives." };
  }
  return { ok: true, valeur: v };
}

// --- Montant de cotisation (en euros) -> centimes ---
export function validerMontantEuros(brut: string | number): Resultat<number> {
  const n = typeof brut === "number" ? brut : Number(brut.replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, erreur: "Le montant doit être un nombre positif." };
  }
  if (n > 10000) {
    return { ok: false, erreur: "Le montant semble trop élevé (max 10 000 €)." };
  }
  // Conversion en centimes, arrondi au centime.
  return { ok: true, valeur: Math.round(n * 100) };
}
