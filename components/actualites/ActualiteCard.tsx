import Image from "next/image";
import { ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SOURCE_COLORS: Record<string, string> = {
  UNICEF: "#00aeef",
  ReliefWeb: "#ee6300",
  OCHA: "#009fe3",
  UNHCR: "#003399",
  Autre: "#6b7280",
};

const SOURCE_LABELS: Record<string, string> = {
  UNICEF: "UNICEF Mali",
  ReliefWeb: "ReliefWeb",
  OCHA: "OCHA Mali",
  UNHCR: "UNHCR Mali",
  Autre: "Autre source",
};

interface ActualiteCardProps {
  titre: string;
  resume?: string | null;
  imageUrl?: string | null;
  source: string;
  sourceUrl: string;
  publieLe?: Date | string | null;
}

export default function ActualiteCard({
  titre,
  resume,
  imageUrl,
  source,
  sourceUrl,
  publieLe,
}: ActualiteCardProps) {
  const color = SOURCE_COLORS[source] || SOURCE_COLORS.Autre;
  const label = SOURCE_LABELS[source] || source;
  const isMali = ["mali", "malien", "bamako", "tombouctou", "gao", "mopti"].some(
    kw => titre.toLowerCase().includes(kw)
  );

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "var(--bg-white)",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid var(--border)",
        transition: "box-shadow 0.2s, transform 0.2s",
        textDecoration: "none",
      }}
      className="actu-card"
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={titre}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 380px"
            unoptimized
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color, fontWeight: 800, fontSize: "1.5rem" }}>
              {source}
            </span>
          </div>
        )}
        {/* Badge source */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: color,
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
        {isMali && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#1A5FA8",
              color: "white",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Mali
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--text)",
            lineHeight: 1.4,
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {titre}
        </h3>
        {resume && (
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "0.75rem",
            }}
          >
            {resume}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          {publieLe && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={12} />
              {format(new Date(publieLe), "d MMM yyyy", { locale: fr })}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4, color, fontWeight: 600 }}>
            Lire la suite
            <ExternalLink size={12} />
          </span>
        </div>
      </div>

      <style>{`
        .actu-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </a>
  );
}
