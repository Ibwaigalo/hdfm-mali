import Link from "next/link";
import { Radio, Globe, Users } from "lucide-react";

const stats = [
  { label: "Fréquence", value: "96.00 FM" },
  { label: "Ville", value: "Bamako" },
  { label: "Langues", value: "3 langues" },
];

const valeurs = [
  {
    icon: Radio,
    titre: "Information de qualité",
    texte: "Une programmation rigoureuse axée sur l'actualité humanitaire, les droits humains et le développement durable au Mali.",
  },
  {
    icon: Globe,
    titre: "Couverture multilingue",
    texte: "Journaux et émissions en français, arabe et bambara pour toucher toutes les communautés du Mali.",
  },
  {
    icon: Users,
    titre: "Voix des communautés",
    texte: "Un espace d'expression pour les acteurs humanitaires, les populations et les décideurs du secteur.",
  },
];

export default function AProposSection() {
  return (
    <section style={{ padding: "4rem 1.5rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Chiffres */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "4rem",
            maxWidth: 600,
            margin: "0 auto 4rem",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                background: "var(--blue)",
                borderRadius: 10,
                padding: "1.5rem 1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "0.25rem",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: "0.75rem",
            }}
          >
            Notre mission
          </h2>
          <div style={{ width: 40, height: 3, background: "var(--green)", borderRadius: 2, margin: "0 auto 1rem" }} />
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 600, margin: "0 auto" }}>
            Radio Humanité et Développement est une station de radio engagée dans la promotion de l'action humanitaire, de la solidarité et du développement durable au Mali et en Afrique de l'Ouest.
          </p>
        </div>

        {/* Valeurs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {valeurs.map(({ icon: Icon, titre, texte }) => (
            <div
              key={titre}
              style={{
                background: "var(--bg-white)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "1.75rem",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(26,95,168,0.08)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <Icon size={22} color="var(--blue)" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                }}
              >
                {titre}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{texte}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              background: "var(--blue)",
              color: "white",
              padding: "0.875rem 2rem",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
