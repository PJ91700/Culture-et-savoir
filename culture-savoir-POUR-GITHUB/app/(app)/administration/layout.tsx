import { exigerRole } from "@/lib/guard";

// Ce layout protège TOUTES les pages sous /administration.
// Un non-admin est automatiquement redirigé (voir lib/guard.ts).
export default async function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["ADMIN"]);
  return <section>{children}</section>;
}
