import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EmissionCardProps {
  ytVideoId: string;
  titre: string;
  thumbnailUrl: string;
  duree: string;
  publishedAt: Date | string;
  categorie?: string | null;
}

export default function EmissionCard({
  ytVideoId,
  titre,
  thumbnailUrl,
  duree,
  publishedAt,
  categorie,
}: EmissionCardProps) {
  const date = new Date(publishedAt);

  return (
    <Link
      href={`/emissions/${ytVideoId}`}
      style={{
        display: "block",
        background: "var(--bg-white)",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid var(--border)",
        transition: "box-shadow 0.2s, transform 0.2s",
        textDecoration: "none",
      }}
      className="emission-card"
    >
      {/* Miniature */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={titre}
            fill
            unoptimized
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>HD FM</span>
          </div>
        )}
        {/* Badge durée */}
        {duree && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.8)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            {duree}
          </div>
        )}
        {/* Badge catégorie */}
        {categorie && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "var(--blue)",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {categorie}
          </div>
        )}
      </div>

      {/* Infos */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={12} />
            {format(date, "d MMM yyyy", { locale: fr })}
          </span>
          {duree && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} />
              {duree}
            </span>
          )}
        </div>
      </div>

      <style>{`
        .emission-card:hover {
          box-shadow: 0 4px 20px rgba(26, 95, 168, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
    </Link>
  );
}
