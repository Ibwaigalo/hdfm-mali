import Link from "next/link";
import Image from "next/image";
import { Play, Clock } from "lucide-react";

interface Emission {
  id: number;
  ytVideoId: string;
  titre: string;
  thumbnailUrl: string | null;
  duree: string | null;
  publishedAt: Date;
}

export default function EmissionsRecentes({ emissions }: { emissions: Emission[] }) {
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
              Dernières émissions
            </h2>
            <div style={{ width: 40, height: 3, background: "var(--green)", borderRadius: 2 }} />
          </div>
          <Link
            href="/emissions"
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--blue)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Voir toutes les émissions &rarr;
          </Link>
        </div>

        {emissions.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
            Les émissions apparaîtront ici automatiquement après synchronisation YouTube.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {emissions.map((em) => (
              <EmissionCard key={em.id} emission={em} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EmissionCard({ emission }: { emission: Emission }) {
  const dateStr = new Date(emission.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/emissions/${emission.ytVideoId}`}
      style={{
        display: "block",
        background: "var(--bg-white)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        textDecoration: "none",
      }}
      className="emission-card"
    >
      {/* Miniature */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
        {emission.thumbnailUrl ? (
          <Image
            src={emission.thumbnailUrl}
            alt={emission.titre}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={32} color="white" />
          </div>
        )}
        {/* Overlay play */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
          className="play-overlay"
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={20} color="var(--blue)" fill="var(--blue)" />
          </div>
        </div>
        {/* Durée */}
        {emission.duree && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.8)",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {emission.duree}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.4,
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {emission.titre}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
          }}
        >
          <Clock size={12} />
          {dateStr}
        </div>
      </div>

      <style>{`
        .emission-card:hover {
          box-shadow: 0 8px 24px rgba(26,95,168,0.12);
          transform: translateY(-2px);
        }
        .emission-card:hover .play-overlay {
          opacity: 1;
        }
      `}</style>
    </Link>
  );
}
