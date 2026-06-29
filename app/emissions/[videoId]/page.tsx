import { sqlQuery } from "@/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EmissionPage({ params }: { params: { videoId: string } }) {
  const emission = await sqlQuery`SELECT id, yt_video_id as "ytVideoId", titre, description, thumbnail_url as "thumbnailUrl", duree, published_at as "publishedAt", synced_at as "syncedAt", visible, categorie FROM emissions WHERE yt_video_id = ${params.videoId} LIMIT 1` as any[];
  if (!emission[0]) notFound();
  const e = emission[0];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <Link href="/emissions" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--blue)", fontWeight: 600, marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} /> Retour aux émissions
      </Link>

      {/* Player YouTube */}
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 12, overflow: "hidden", background: "#000", marginBottom: "2rem" }}>
        <iframe
          src={`https://www.youtube.com/embed/${e.ytVideoId}?rel=0`}
          title={e.titre}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>

      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "1rem" }}>{e.titre}</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Calendar size={14} /> {format(new Date(e.publishedAt), "d MMMM yyyy", { locale: fr })}
        </span>
        {e.duree && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={14} /> {e.duree}
          </span>
        )}
        {e.categorie && (
          <span style={{ background: "var(--blue)", color: "white", padding: "2px 10px", borderRadius: 4, fontWeight: 600, fontSize: "0.75rem" }}>
            {e.categorie}
          </span>
        )}
      </div>

      {e.description && (
        <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.5rem" }}>
          <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem", color: "var(--text)" }}>Description</h2>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>{e.description}</p>
        </div>
      )}
    </div>
  );
}
