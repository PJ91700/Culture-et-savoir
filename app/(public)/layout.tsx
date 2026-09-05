import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

// Toutes les pages publiques (vitrine) partagent cet habillage.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
