# Culture & Savoir — MVP

Application web complète de l'école Culture & Savoir : **site vitrine + espaces connectés**, réunis dans un seul projet Next.js.

## Ce que contient le MVP

### Site vitrine (public, sans connexion)
- **Accueil** : hero calligraphique, présentation des 4 espaces, raccourcis
- **L'association** : infos légales réelles (SIREN, adresse), projet, pédagogie, et le **catalogue complet des classes** (Enfants 7 niveaux, Ados, Femmes adultes)
- **Inscription** : parcours en 4 étapes (parent → enfant & classe → documents → paiement)
- **Équipe** : direction, postes à pourvoir, candidature spontanée
- **Faire un don** : don ponctuel ou mensuel (via HelloAsso)
- **Contact** : bureau et bénévoles

### Espaces connectés (protégés par rôle)
- **Parents** : suivi des enfants, présences, bulletins, messagerie
- **Élèves** : cours, quiz, emploi du temps
- **Professeurs** : émargement, cahier de texte, carnet de notes
- **Administration** : tableau de bord, classes (depuis le catalogue), comptes, cotisations

### Socle technique
- **Next.js 14** (App Router) — site et espaces dans un seul projet
- **Design system unifié** (`app/globals.css`) : palette manuscrit, typographie Amiri + Inter, **support RTL** (français/arabe)
- **NextAuth** : connexion par email/mot de passe, rôle dans la session, redirection automatique vers le bon espace
- **Prisma + PostgreSQL** : modèle de données complet
- **Webhook HelloAsso** : valide l'inscription dès le paiement confirmé
- **Catalogue** (`lib/catalogue.ts`) : l'offre réelle de l'école (13 niveaux)

## Lancer le projet (chez vous)

```bash
npm install
cp .env.example .env          # remplir DATABASE_URL, NEXTAUTH_SECRET…
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts        # comptes de démo (mdp : motdepasse)
npm run dev                   # http://localhost:3000
```

Comptes de démo : `admin@exemple.fr`, `parent@exemple.fr`, `prof@exemple.fr`, `eleve@exemple.fr`.

## Qualité vérifiée

- **Build Next.js complet réussi** : les 21 routes compilent (`next build`)
- Vérification de types TypeScript : 0 erreur
- 78+ tests métier (validations, catalogue, émargement, notes, contrôle d'accès), tous verts
- Rendu visuel vérifié page par page

## Ce qui reste avant la mise en production

- Compte HelloAsso de l'association (identifiants API) pour activer le paiement réel
- Stockage des fichiers (pièces justificatives, audios) : S3/R2 à brancher
- Remplacer les contenus [entre crochets] par les vraies infos (noms du bureau, projet pédagogique…)
- Contenu détaillé des espaces élève/parent (branché sur la base)
