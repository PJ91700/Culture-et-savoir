import { EspaceHeader } from "./EspaceHeader";

// Habillage commun à tous les espaces connectés.
// La protection par rôle reste gérée par le layout de CHAQUE espace
// (parents/layout.tsx, administration/layout.tsx, etc.).
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EspaceHeader />
      <div className="wrap" style={{ paddingBlock: 24 }}>
        {children}
      </div>
    </>
  );
}
