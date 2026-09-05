import { exigerRole } from "@/lib/guard";

export default async function ParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(["PARENT"]);
  return <section>{children}</section>;
}
