# Déroulé des inscriptions — Culture & Savoir

Ce document décrit le fonctionnement des inscriptions, tel qu'il sera implémenté
dans l'application (inspiré du fonctionnement actuel de l'école).

## Deux filières distinctes

1. **Arabe & éducation islamique** — cours en journée
   - Créneaux : Mercredi 9h-13h, Mercredi 14h-18h, Samedi 9h-13h, Samedi 14h-18h, Dimanche 9h-13h
   - 7 niveaux : Préparatoire, Niveau 1 à 5, Avancé
   - **15 places maximum par créneau**
   - Les niveaux avancés ouvrent sur moins de créneaux (N4 : 4, N5 : 3, Avancé : dimanche uniquement)

2. **Règles Lumineuses (tajwid)** — cours en soirée
   - Créneaux par binômes de jours : Lundi & Jeudi, Mardi & Vendredi, Mercredi & Dimanche
   - 3 niveaux
   - **14 places maximum par créneau**

## Étapes du parcours d'inscription

1. **Parent** : père, mère, professions, téléphone du parent référent, téléphone
   d'urgence, adresse postale, ville. Un même dossier peut inscrire **plusieurs
   enfants** (jusqu'à 5).

2. **Enfant & cours** : nom, prénom, sexe, date de naissance, classe à l'école
   publique. Puis choix de la **filière**, du **niveau**, et du **créneau**
   (uniquement parmi les créneaux encore disponibles).
   - **Santé** : problèmes de santé éventuels, suivi médical. *(Donnée sensible :
     à protéger avec un soin particulier — RGPD, accès restreint.)*

3. **Documents** : dépôt de l'**attestation d'assurance** (obligatoire) et de
   l'attestation d'engagement.

4. **Paiement** : cotisation via HelloAsso.
   - **Le paiement est annuel, réglé en début d'année, définitif et non
     remboursable** en cas d'interruption des cours par l'élève.
   - L'inscription est **validée automatiquement** dès confirmation du paiement
     (via le webhook HelloAsso).

## Gestion des places

- Chaque créneau a une capacité (15 ou 14 selon la filière).
- Quand un créneau est complet, il n'est plus proposé (« Sessions complètes »).
- Le décompte des places réservées se fait à la validation de l'inscription
  (après paiement confirmé), pour éviter de bloquer une place sur un dossier
  non payé.

## Points de vigilance

- **Données de santé d'enfants mineurs** : chiffrement, accès limité à
  l'administration, conservation encadrée (RGPD).
- **Réinscriptions** : prévoir un parcours simplifié pour les familles déjà
  connues (pré-remplissage), distinct de la première inscription.
