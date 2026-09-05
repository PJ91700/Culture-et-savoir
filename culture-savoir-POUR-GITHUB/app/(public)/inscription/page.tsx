import { InscriptionForm } from "./InscriptionForm";

// Page publique d'inscription (parcours en 4 étapes).
export default function InscriptionPage() {
  return (
    <section className="band">
      <div className="wrap narrow">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span className="kicker" style={{ justifyContent: "center" }}>Année 2026 – 2027</span>
          <h1 className="title">Inscrire mon enfant</h1>
        </div>
        <InscriptionForm />
      </div>
    </section>
  );
}
