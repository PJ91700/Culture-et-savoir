// Logique métier des places d'une classe.
// La capacité est portée par CHAQUE classe (pilotée par l'admin).
// Une place est considérée occupée par une inscription VALIDÉE (payée) OU
// en attente de paiement récente — mais pour rester simple et éviter de bloquer
// des places sur des dossiers non finalisés, on compte ici les inscriptions
// validées, plus celles en attente (une inscription en attente réserve la place
// le temps du paiement).
//
// Ces fonctions sont pures : elles prennent les nombres en entrée et sont donc
// testables sans base de données.

export type EtatPlaces = {
  capacite: number;
  occupees: number;
  restantes: number;
  complete: boolean;
};

// Calcule l'état des places d'une classe.
export function calculerPlaces(capacite: number, occupees: number): EtatPlaces {
  const restantes = Math.max(0, capacite - occupees);
  return {
    capacite,
    occupees,
    restantes,
    complete: restantes === 0,
  };
}

// Une classe accepte-t-elle une nouvelle inscription ?
// Elle doit être ouverte ET avoir de la place.
export function peutInscrire(params: {
  ouverte: boolean;
  capacite: number;
  occupees: number;
}): { ok: true } | { ok: false; raison: string } {
  if (!params.ouverte) {
    return { ok: false, raison: "Cette classe est fermée aux inscriptions." };
  }
  const places = calculerPlaces(params.capacite, params.occupees);
  if (places.complete) {
    return { ok: false, raison: "Cette classe est complète." };
  }
  return { ok: true };
}

// Libellé lisible de disponibilité, pour l'affichage.
export function libellePlaces(etat: EtatPlaces): string {
  if (etat.complete) return "Complet";
  if (etat.restantes === 1) return "1 place restante";
  return `${etat.restantes} places restantes`;
}
