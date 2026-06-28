import Link from "next/link";
import Image from "next/image";

interface Actu {
  id: number;
  titre: string;
  resume: string | null;
  imageUrl: string | null;
  source: string;
  sourceUrl: string;
  publieLe: Date | null;
}

const SOURCE_COLORS: Record<string, string> = {
  UNICEF: "#00aeef",
  ReliefWeb: "#e63529",
  OCHA: "#009edb",
  UNHCR: "#00b398",
  Autre: "#6b7280",
};

export default function ActualitesPreview({ actualites }: { actualites: Actu[] }) {
  return (
    <section style={{ padding: "4rem 1.5rem", background: "var(--bg-white)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: "0.25rem",
              }}
            >
              Actualités humanitaires
            </h2>
            <div style={{ width: 40, height: 3, background: "var(--green)", borderRadius: 2 }} />
          </div>
          <Link
            href="/actualites"
            style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--blue)" }}
          >
            Toutes les actualités &rarr;
          </Link>
        </div>

        {actualites.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
            Les actualités se chargent automatiquement depuis UNICEF, ReliefWeb, OCHA et UNHCR.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {actualites.map((actu) => (
              <ActuCard key={actu.id} actu={actu} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ActuCard({ actu }: { actu: Actu }) {
  const sourceColor = SOURCE_COLORS[actu.source] || SOURCE_COLORS.Autre;
  const dateStr = actu.publieLe
    ? new Date(actu.publieLe).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={actu.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "var(--bg-white)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        textDecoration: "none",
      }}
      className="actu-card"
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
        {actu.imageUrl ? (
          <Image
            src={actu.imageUrl}
            alt={actu.titre}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 340px"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `${sourceColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: sourceColor, opacity: 0.3 }}>
              {actu.source}
            </span>
          </div>
        )}
        {/* Badge source */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: sourceColor,
            color: "white",
            fontSize: "0.65rem",
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 4,
            letterSpacing: "0.04em",
          }}
        >
          {actu.source}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.45,
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {actu.titre}
        </h3>
        {actu.resume && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "0.75rem",
            }}
          >
            {actu.resume}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {dateStr && (
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{dateStr}</span>
          )}
          <span style={{ fontSize: "0.72rem", color: "var(--blue)", fontWeight: 700 }}>
            Lire l'article &rarr;
          </span>
        </div>
      </div>

      <style>{`
        .actu-card:hover {
          box-shadow: 0 8px 24px rgba(26,95,168,0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </a>
  );
}
