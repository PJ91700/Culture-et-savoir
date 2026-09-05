import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

// Configuration de l'authentification.
// On utilise une connexion par email + mot de passe (Credentials), car les
// comptes sont créés par l'école (parents à l'inscription, profs/admin par
// l'administration) — il n'y a pas d'inscription libre via un fournisseur externe.
//
// Le rôle (PARENT / ELEVE / PROFESSEUR / ADMIN) est embarqué dans le token JWT
// puis dans la session, ce qui permet de protéger chaque espace côté serveur
// sans requête supplémentaire à la base.

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion", // notre page de connexion personnalisée
  },
  providers: [
    CredentialsProvider({
      name: "Email et mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!utilisateur || !utilisateur.motDePasseHash) {
          return null;
        }

        const motDePasseValide = await bcrypt.compare(
          credentials.password,
          utilisateur.motDePasseHash
        );

        if (!motDePasseValide) {
          return null;
        }

        // L'objet retourné devient la base du token JWT
        return {
          id: utilisateur.id,
          email: utilisateur.email,
          role: utilisateur.role,
        };
      },
    }),
  ],
  callbacks: {
    // On recopie l'id et le rôle dans le token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: Role }).role;
      }
      return token;
    },
    // ...puis du token vers la session, accessible côté client et serveur
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};
