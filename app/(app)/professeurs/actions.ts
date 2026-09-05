"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { exigerRole } from "@/lib/guard";
import { professeurAccedeClasse } from "@/lib/prof-access";
import {
  validerNote,
  validerTrimestre,
  validerFeuillePresence,
  type SaisiePresence,
} from "@/lib/validation/professeur";
import { validerTexteRequis } from "@/lib/validation";

export type ActionState = { ok: boolean; message: string };

// ---------- Émargement : enregistrer les présences d'une classe pour une date ----------
export async function enregistrerPresences(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await exigerRole(["PROFESSEUR"]);

  const classeId = String(formData.get("classeId") ?? "");
  const dateStr = String(formData.get("date") ?? "");

  // Sécurité : le prof doit enseigner dans cette classe.
  const acces = await professeurAccedeClasse(session.user.id, classeId);
  if (!acces) {
    return { ok: false, message: "Vous n'avez pas accès à cette classe." };
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: "Date invalide." };
  }

  // Les présences arrivent encodées : pour chaque élève, un champ
  // present_<id> (on/absent) et retard_<id> (on/off).
  const eleves = await prisma.eleve.findMany({
    where: { classeId },
    select: { id: true },
  });

  const saisies: SaisiePresence[] = eleves.map((e: { id: string }) => ({
    eleveId: e.id,
    present: formData.get(`present_${e.id}`) === "on",
    retard: formData.get(`retard_${e.id}`) === "on",
  }));

  const validation = validerFeuillePresence(saisies);
  if (!validation.ok) {
    return { ok: false, message: validation.erreur };
  }

  // On remplace les présences existantes de cette date pour cette classe,
  // puis on réécrit — le tout dans une transaction (idempotent si re-soumis).
  await prisma.$transaction([
    prisma.presence.deleteMany({
      where: { date, eleve: { classeId } },
    }),
    prisma.presence.createMany({
      data: validation.valeur.map((s) => ({
        eleveId: s.eleveId,
        date,
        present: s.present,
        retard: s.retard,
        saisiPar: acces.id,
      })),
    }),
  ]);

  revalidatePath("/professeurs/emargement");
  return {
    ok: true,
    message: `Présences enregistrées (${saisies.length} élève(s)).`,
  };
}

// ---------- Cahier de texte : ajouter une entrée ----------
export async function ajouterCahierTexte(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await exigerRole(["PROFESSEUR"]);

  const classeId = String(formData.get("classeId") ?? "");
  const acces = await professeurAccedeClasse(session.user.id, classeId);
  if (!acces) {
    return { ok: false, message: "Vous n'avez pas accès à cette classe." };
  }

  const lecon = validerTexteRequis(String(formData.get("lecon") ?? ""), "La leçon");
  if (!lecon.ok) return { ok: false, message: lecon.erreur };

  const dateStr = String(formData.get("date") ?? "");
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: "Date invalide." };
  }

  const devoirs = String(formData.get("devoirs") ?? "").trim() || null;

  await prisma.cahierTexte.create({
    data: { classeId, date, lecon: lecon.valeur, devoirs },
  });

  revalidatePath("/professeurs/cahier-texte");
  return { ok: true, message: "Entrée ajoutée au cahier de texte." };
}

// ---------- Carnet de notes : saisir une note ----------
export async function saisirNote(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await exigerRole(["PROFESSEUR"]);

  const eleveId = String(formData.get("eleveId") ?? "");
  const matiereId = String(formData.get("matiereId") ?? "");

  // On récupère la classe de l'élève pour vérifier l'accès du prof.
  const eleve = await prisma.eleve.findUnique({
    where: { id: eleveId },
    select: { classeId: true },
  });
  if (!eleve?.classeId) {
    return { ok: false, message: "Élève introuvable ou sans classe." };
  }

  const acces = await professeurAccedeClasse(session.user.id, eleve.classeId);
  if (!acces) {
    return { ok: false, message: "Vous n'avez pas accès à cet élève." };
  }

  const note = validerNote(String(formData.get("valeur") ?? ""));
  if (!note.ok) return { ok: false, message: note.erreur };

  const trimestre = validerTrimestre(String(formData.get("trimestre") ?? ""));
  if (!trimestre.ok) return { ok: false, message: trimestre.erreur };

  const appreciation = String(formData.get("appreciation") ?? "").trim() || null;

  await prisma.note.create({
    data: {
      eleveId,
      matiereId,
      valeur: note.valeur,
      trimestre: trimestre.valeur,
      appreciation,
    },
  });

  revalidatePath("/professeurs/notes");
  return { ok: true, message: `Note ${note.valeur}/20 enregistrée.` };
}
