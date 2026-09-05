import { exigerRole } from "@/lib/guard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["PROFESSEUR"]);
  return <section>{children}</section>;
}
