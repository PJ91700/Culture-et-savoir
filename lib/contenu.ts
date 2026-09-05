// Contenu éditorial du site vitrine.
// Ces données sont volontairement séparées des pages pour être facilement
// modifiables par l'équipe (et, à terme, gérables depuis l'espace admin).
// Les valeurs entre [crochets] sont des exemples à confirmer.

export type Stat = { valeur: string; label: string };
export const STATS: Stat[] = [
  { valeur: "7", label: "niveaux d'enseignement, du préparatoire à l'avancé" },
  { valeur: "3", label: "publics accueillis : enfants, adolescents, femmes adultes" },
  { valeur: "2023", label: "année de création de l'association" },
  { valeur: "[—]", label: "élèves accompagnés cette année" },
];

export type Valeur = { titre: string; texte: string };
export const VALEURS: Valeur[] = [
  {
    titre: "Excellence",
    texte:
      "Une exigence pédagogique réelle : progression par niveaux, suivi individualisé et évaluation régulière.",
  },
  {
    titre: "Transmission",
    texte:
      "La langue arabe et le Coran enseignés avec méthode, pour des bases solides et durables.",
  },
  {
    titre: "Bienveillance",
    texte:
      "Un cadre structuré et respectueux du rythme de chaque enfant, dans un esprit de confiance.",
  },
];

export type Actualite = {
  slug: string;
  titre: string;
  date: string; // affichée telle quelle
  extrait: string;
  corps: string[]; // paragraphes
  categorie: string;
};

export const ACTUALITES: Actualite[] = [
  {
    slug: "rentree-2026",
    titre: "Rentrée scolaire 2026-2027",
    date: "Août 2026",
    categorie: "Vie de l'école",
    extrait:
      "Dates, horaires et organisation des cours pour la nouvelle année. Toutes les informations pratiques pour bien démarrer.",
    corps: [
      "[À compléter] La rentrée pour les cours d'arabe et de Coran approche. Les créneaux du mercredi, du samedi et du dimanche matin reprennent selon les niveaux.",
      "Les familles inscrites recevront le détail des horaires et des salles par email et via leur espace parent.",
    ],
  },
  {
    slug: "inscriptions-ouvertes",
    titre: "Les inscriptions 2026-2027 sont ouvertes",
    date: "Juillet 2026",
    categorie: "Inscriptions",
    extrait:
      "Enfants, adolescents et femmes adultes : les inscriptions pour la nouvelle année scolaire sont ouvertes en ligne.",
    corps: [
      "[À compléter] L'inscription se fait entièrement en ligne : dépôt du dossier, choix de la classe et règlement de la cotisation.",
      "Le nombre de places par niveau étant limité, nous encourageons les familles à s'inscrire tôt.",
    ],
  },
  {
    slug: "cours-femmes-adultes",
    titre: "Nouveaux créneaux pour les femmes adultes",
    date: "Juin 2026",
    categorie: "Nouveauté",
    extrait:
      "Des cours dédiés aux femmes adultes, répartis par niveau : débutantes, intermédiaires et avancées.",
    corps: [
      "[À compléter] Trois niveaux sont proposés : débutantes le dimanche après-midi, intermédiaires le jeudi soir, avancées le mardi soir.",
    ],
  },
];

export type Temoignage = { texte: string; auteur: string };
export const TEMOIGNAGES: Temoignage[] = [
  {
    texte:
      "[Témoignage à recueillir] Une école où mes enfants apprennent l'arabe avec plaisir et sérieux. L'équipe est à l'écoute et bienveillante.",
    auteur: "Un parent d'élève",
  },
  {
    texte:
      "[Témoignage à recueillir] J'ai repris l'apprentissage de l'arabe à l'âge adulte, dans un cadre rassurant et bien organisé.",
    auteur: "Une élève du cours femmes adultes",
  },
];
