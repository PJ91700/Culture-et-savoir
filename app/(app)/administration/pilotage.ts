"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { exigerRole } from "@/lib/guard";
import { validerTexteRequis, validerMontantEuros } from "@/lib/validation";

export type ActionState = { ok: boolean; message: string };

// ------------------------------------------------------------------
// Piloter une CLASSE : capacité, ouverture/fermeture, tarif, nom.
// ------------------------------------------------------------------

// Modifier la capacité (nombre de places) d'une classe.
export async function modifierCapacite(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const classeId = String(formData.get("classeId") ?? "");
  const capaciteBrut = String(formData.get("capacite") ?? "");
  const capacite = Number(capaciteBrut);

  if (!Number.isInteger(capacite) || capacite < 1 || capacite > 200) {
    return { ok: false, message: "La capacité doit être un entier entre 1 et 200." };
  }

  await prisma.classe.update({
    where: { id: classeId },
    data: { capacite },
  });

  revalidatePath("/administration/classes");
  return { ok: true, message: `Capacité mise à jour : ${capacite} places.` };
}

// Ouvrir ou fermer une classe aux inscriptions.
export async function basculerOuvertureClasse(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const classeId = String(formData.get("classeId") ?? "");
  const ouverte = String(formData.get("ouverte") ?? "") === "true";

  await prisma.classe.update({
    where: { id: classeId },
    data: { ouverte },
  });

  revalidatePath("/administration/classes");
  return {
    ok: true,
    message: ouverte ? "Classe ouverte aux inscriptions." : "Classe fermée.",
  };
}

// Modifier le tarif de cotisation (en euros -> centimes).
export async function modifierTarif(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const classeId = String(formData.get("classeId") ?? "");
  const tarif = validerMontantEuros(String(formData.get("tarif") ?? ""));
  if (!tarif.ok) return { ok: false, message: tarif.erreur };

  await prisma.classe.update({
    where: { id: classeId },
    data: { tarifCentimes: tarif.valeur },
  });

  revalidatePath("/administration/classes");
  return {
    ok: true,
    message: `Tarif mis à jour : ${(tarif.valeur / 100).toFixed(2)} €.`,
  };
}

// Renommer une classe.
export async function renommerClasse(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const classeId = String(formData.get("classeId") ?? "");
  const nom = validerTexteRequis(String(formData.get("nom") ?? ""), "Le nom");
  if (!nom.ok) return { ok: false, message: nom.erreur };

  await prisma.classe.update({
    where: { id: classeId },
    data: { nom: nom.valeur },
  });

  revalidatePath("/administration/classes");
  return { ok: true, message: "Classe renommée." };
}

// Supprimer une classe (uniquement si elle n'a aucune inscription).
export async function supprimerClasse(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const classeId = String(formData.get("classeId") ?? "");
  const nbInscriptions = await prisma.inscription.count({ where: { classeId } });
  if (nbInscriptions > 0) {
    return {
      ok: false,
      message: "Impossible de supprimer : des inscriptions existent. Fermez plutôt la classe.",
    };
  }

  await prisma.classe.delete({ where: { id: classeId } });
  revalidatePath("/administration/classes");
  return { ok: true, message: "Classe supprimée." };
}

// ------------------------------------------------------------------
// Piloter les RÉGLAGES globaux : période d'inscription, année active.
// ------------------------------------------------------------------

// Ouvrir/fermer la période d'inscription pour toute l'école.
export async function basculerInscriptions(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const ouvertes = String(formData.get("ouvertes") ?? "") === "true";
  const message = String(formData.get("message") ?? "").trim() || null;

  await prisma.reglages.upsert({
    where: { id: "global" },
    create: { id: "global", inscriptionsOuvertes: ouvertes, messageInscription: message },
    update: { inscriptionsOuvertes: ouvertes, messageInscription: message },
  });

  revalidatePath("/administration/reglages");
  revalidatePath("/inscription");
  return {
    ok: true,
    message: ouvertes
      ? "Les inscriptions sont maintenant ouvertes."
      : "Les inscriptions sont fermées.",
  };
}

// Passer à une nouvelle année scolaire (définit l'année active).
export async function definirAnneeActive(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await exigerRole(["ADMIN"]);

  const annee = String(formData.get("annee") ?? "").trim();
  if (!/^\d{4}-\d{4}$/.test(annee)) {
    return { ok: false, message: "Format d'année attendu : AAAA-AAAA." };
  }
  const [debut, fin] = annee.split("-").map(Number);
  if (fin !== debut + 1) {
    return { ok: false, message: "L'année doit couvrir deux années consécutives." };
  }

  await prisma.reglages.upsert({
    where: { id: "global" },
    create: { id: "global", anneeActive: annee },
    update: { anneeActive: annee },
  });

  revalidatePath("/administration/reglages");
  return { ok: true, message: `Année active définie : ${annee}.` };
}
