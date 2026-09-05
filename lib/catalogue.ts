// Catalogue officiel des enseignements de l'école Culture & Savoir.
// Reflète le fonctionnement réel : deux filières distinctes, des créneaux
// horaires précis, chacun avec une capacité limitée (fermeture automatique
// quand le créneau est complet).
//
// Filière 1 — Arabe & éducation islamique : cours en journée (mercredi,
//   samedi, dimanche), 7 niveaux du préparatoire à l'avancé.
// Filière 2 — Règles Lumineuses (tajwid / récitation) : cours en soirée,
//   par binômes de jours.
//
// NB (règle de l'école) : le paiement est annuel, réglé en début d'année,
// définitif et non remboursable en cas d'interruption.

export type Jour =
  | "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI" | "DIMANCHE";

export type CreneauCatalogue = {
  code: string;      // identifiant stable (ex: "MER_MATIN")
  libelle: string;   // ex: "Mercredi 9h – 13h"
  capacite: number;  // nombre de places maximum
};

export type NiveauCatalogue = {
  code: string;
  libelle: string;
  creneaux: CreneauCatalogue[];
};

export type FiliereCatalogue = {
  code: string;
  libelle: string;
  description: string;
  niveaux: NiveauCatalogue[];
};

// Créneaux filière Arabe (journée, 15 places)
const MER_MATIN: CreneauCatalogue = { code: "MER_MATIN", libelle: "Mercredi 9h – 13h", capacite: 15 };
const MER_APREM: CreneauCatalogue = { code: "MER_APREM", libelle: "Mercredi 14h – 18h", capacite: 15 };
const SAM_MATIN: CreneauCatalogue = { code: "SAM_MATIN", libelle: "Samedi 9h – 13h", capacite: 15 };
const SAM_APREM: CreneauCatalogue = { code: "SAM_APREM", libelle: "Samedi 14h – 18h", capacite: 15 };
const DIM_MATIN: CreneauCatalogue = { code: "DIM_MATIN", libelle: "Dimanche 9h – 13h", capacite: 15 };

// Créneaux filière Règles Lumineuses (soirée, 14 places)
const RL_LUN_JEU: CreneauCatalogue = { code: "RL_LUN_JEU", libelle: "Lundi & Jeudi (soir)", capacite: 14 };
const RL_MAR_VEN: CreneauCatalogue = { code: "RL_MAR_VEN", libelle: "Mardi & Vendredi (soir)", capacite: 14 };
const RL_MER_DIM: CreneauCatalogue = { code: "RL_MER_DIM", libelle: "Mercredi & Dimanche (soir)", capacite: 14 };

export const CATALOGUE: FiliereCatalogue[] = [
  {
    code: "ARABE",
    libelle: "Arabe & éducation islamique",
    description:
      "Cours d'arabe et d'éducation islamique pour enfants, du niveau préparatoire au niveau avancé.",
    niveaux: [
      { code: "AR_PREPA", libelle: "Préparatoire", creneaux: [MER_MATIN, MER_APREM, SAM_MATIN, SAM_APREM, DIM_MATIN] },
      { code: "AR_N1", libelle: "Niveau 1", creneaux: [MER_MATIN, MER_APREM, SAM_MATIN, SAM_APREM, DIM_MATIN] },
      { code: "AR_N2", libelle: "Niveau 2", creneaux: [MER_MATIN, MER_APREM, SAM_MATIN, SAM_APREM, DIM_MATIN] },
      { code: "AR_N3", libelle: "Niveau 3", creneaux: [MER_MATIN, MER_APREM, SAM_MATIN, SAM_APREM, DIM_MATIN] },
      { code: "AR_N4", libelle: "Niveau 4", creneaux: [MER_APREM, SAM_MATIN, SAM_APREM, DIM_MATIN] },
      { code: "AR_N5", libelle: "Niveau 5", creneaux: [MER_APREM, SAM_MATIN, DIM_MATIN] },
      { code: "AR_AVANCE", libelle: "Avancé", creneaux: [DIM_MATIN] },
    ],
  },
  {
    code: "REGLES_LUMINEUSES",
    libelle: "Règles Lumineuses (tajwid)",
    description:
      "Cours de récitation et de règles de lecture du Coran (tajwid), en soirée.",
    niveaux: [
      { code: "RL_N1", libelle: "Niveau 1", creneaux: [RL_LUN_JEU, RL_MAR_VEN, RL_MER_DIM] },
      { code: "RL_N2", libelle: "Niveau 2", creneaux: [RL_LUN_JEU, RL_MAR_VEN, RL_MER_DIM] },
      { code: "RL_N3", libelle: "Niveau 3", creneaux: [RL_LUN_JEU, RL_MAR_VEN, RL_MER_DIM] },
    ],
  },
];

export function trouverFiliere(code: string): FiliereCatalogue | undefined {
  return CATALOGUE.find((f) => f.code === code);
}

export function trouverNiveau(
  codeNiveau: string
): { filiere: FiliereCatalogue; niveau: NiveauCatalogue } | undefined {
  for (const filiere of CATALOGUE) {
    const niveau = filiere.niveaux.find((n) => n.code === codeNiveau);
    if (niveau) return { filiere, niveau };
  }
  return undefined;
}

export function tousLesNiveaux(): {
  codeNiveau: string;
  codeFiliere: string;
  libelleComplet: string;
}[] {
  const liste: { codeNiveau: string; codeFiliere: string; libelleComplet: string }[] = [];
  for (const filiere of CATALOGUE) {
    for (const niveau of filiere.niveaux) {
      liste.push({
        codeNiveau: niveau.code,
        codeFiliere: filiere.code,
        libelleComplet: `${filiere.libelle} · ${niveau.libelle}`,
      });
    }
  }
  return liste;
}

export function creneauxDuNiveau(codeNiveau: string): CreneauCatalogue[] {
  return trouverNiveau(codeNiveau)?.niveau.creneaux ?? [];
}
