"use server";

import { revalidatePath } from "next/cache";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { exigerRole } from "@/lib/guard";
import {
  validerEmail,
  validerMotDePasse,
  validerTexteRequis,
  validerTrancheAge,
  type Resultat,
} from "@/lib/validation";
import { trouverNiveau } from "@/lib/catalogue";

// Toutes les actions ci-dessous sont réservées à l'ADMIN. Chacune revérifie
// le rôle côté serveur (une Server Action est un point d'entrée réseau : on ne
// se repose jamais uniquement sur le fait que l'UI soit cachée).

export type ActionState = { ok: boolean; message: string };

// ---------- Créer une classe ----------
export async function creerClasse(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const nom = validerTexteRequis(String(formData.get("nom") ?? ""), "Le nom de la classe");
  if (!nom.ok) return { ok: false, message: nom.erreur };

  const niveau = validerTexteRequis(String(formData.get("niveau") ?? ""), "Le niveau");
  if (!niveau.ok) return { ok: false, message: niveau.erreur };

  const ageMin = champNombreOptionnel(formData.get("ageMin"));
  const ageMax = champNombreOptionnel(formData.get("ageMax"));
  const age = validerTrancheAge(ageMin, ageMax);
  if (!age.ok) return { ok: false, message: age.erreur };

  const niveauRequis = String(formData.get("niveauRequis") ?? "").trim() || null;

  await prisma.classe.create({
    data: {
      nom: nom.valeur,
      niveau: niveau.valeur,
      ageMin: age.valeur.ageMin,
      ageMax: age.valeur.ageMax,
      niveauRequis,
    },
  });

  revalidatePath("/administration/classes");
  return { ok: true, message: `Classe « ${nom.valeur} » créée.` };
}

// ---------- Créer une classe à partir du catalogue officiel ----------
// L'admin choisit un niveau du catalogue (ex: "Enfants · Niveau 1") et un
// suffixe de groupe (ex: "A"). La classe est créée avec son public, son
// niveau, et ses créneaux pré-remplis depuis le catalogue.
export async function creerClasseDepuisCatalogue(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const niveauCode = String(formData.get("niveauCode") ?? "");
  const entree = trouverNiveau(niveauCode);
  if (!entree) {
    return { ok: false, message: "Niveau inconnu dans le catalogue." };
  }

  // Suffixe de groupe optionnel (A, B, C...) pour distinguer plusieurs classes
  // ouvertes sur le même niveau.
  const groupe = String(formData.get("groupe") ?? "").trim();
  const nom = groupe
    ? `${entree.filiere.libelle} · ${entree.niveau.libelle} — Groupe ${groupe}`
    : `${entree.filiere.libelle} · ${entree.niveau.libelle}`;

  // On récupère (ou crée) une matière générique pour les créneaux si besoin.
  // Ici, on crée d'abord la classe, puis ses créneaux liés au catalogue.
  await prisma.classe.create({
    data: {
      nom,
      niveau: entree.niveau.libelle,
      publicCode: entree.filiere.code,
      niveauCode: entree.niveau.code,
    },
  });

  revalidatePath("/administration/classes");
  return { ok: true, message: `Classe « ${nom} » créée depuis le catalogue.` };
}


export async function creerMatiere(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const nom = validerTexteRequis(String(formData.get("nom") ?? ""), "Le nom de la matière");
  if (!nom.ok) return { ok: false, message: nom.erreur };

  // La matière a un nom unique : on gère proprement le doublon.
  const existe = await prisma.matiere.findUnique({ where: { nom: nom.valeur } });
  if (existe) return { ok: false, message: "Cette matière existe déjà." };

  await prisma.matiere.create({ data: { nom: nom.valeur } });
  revalidatePath("/administration/classes");
  return { ok: true, message: `Matière « ${nom.valeur} » ajoutée.` };
}

// ---------- Créer un compte professeur ----------
export async function creerCompteProfesseur(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const email = validerEmail(String(formData.get("email") ?? ""));
  if (!email.ok) return { ok: false, message: email.erreur };

  const prenom = validerTexteRequis(String(formData.get("prenom") ?? ""), "Le prénom");
  if (!prenom.ok) return { ok: false, message: prenom.erreur };

  const nom = validerTexteRequis(String(formData.get("nom") ?? ""), "Le nom");
  if (!nom.ok) return { ok: false, message: nom.erreur };

  const mdp = validerMotDePasse(String(formData.get("motDePasse") ?? ""));
  if (!mdp.ok) return { ok: false, message: mdp.erreur };

  const dejaPris = await prisma.utilisateur.findUnique({ where: { email: email.valeur } });
  if (dejaPris) return { ok: false, message: "Un compte existe déjà avec cet email." };

  const hash = await bcrypt.hash(mdp.valeur, 10);

  // Compte + profil professeur créés ensemble (atomique).
  await prisma.utilisateur.create({
    data: {
      email: email.valeur,
      motDePasseHash: hash,
      role: "PROFESSEUR",
      professeur: {
        create: { prenom: prenom.valeur, nom: nom.valeur },
      },
    },
  });

  revalidatePath("/administration/comptes");
  return { ok: true, message: `Compte professeur créé pour ${prenom.valeur} ${nom.valeur}.` };
}

// ---------- Affecter un professeur à une classe ----------
export async function affecterProfesseur(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const professeurId = String(formData.get("professeurId") ?? "");
  const classeId = String(formData.get("classeId") ?? "");
  if (!professeurId || !classeId) {
    return { ok: false, message: "Professeur et classe sont requis." };
  }

  await prisma.classe.update({
    where: { id: classeId },
    data: { professeurs: { connect: { id: professeurId } } },
  });

  revalidatePath("/administration/classes");
  return { ok: true, message: "Professeur affecté à la classe." };
}

// --- utilitaire local ---
function champNombreOptionnel(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}
