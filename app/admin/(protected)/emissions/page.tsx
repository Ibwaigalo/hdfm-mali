import { sqlQuery } from "@/db";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Émissions - Admin" };
export const dynamic = 'force-dynamic';

export default async function AdminEmissions() {
  const liste = await sqlQuery`SELECT id, yt_video_id as "ytVideoId", titre, description, thumbnail_url as "thumbnailUrl", duree, published_at as "publishedAt", synced_at as "syncedAt", visible, categorie FROM emissions ORDER BY published_at DESC LIMIT 100` as any[];

  return (
    <div>
      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "#1A1A2E", marginBottom: "0.5rem" }}>Émissions YouTube</h1>
      <p style={{ color: "#5a6474", fontSize: "0.875rem", marginBottom: "2rem" }}>
        {liste.length} émissions synchronisées depuis YouTube. Synchronisation automatique toutes les heures.
      </p>

      <div style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 10, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
              {["Miniature", "Titre", "Durée", "Date publication", "Statut"].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#5a6474", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {liste.map((e, idx) => (
              <tr key={e.id} style={{ borderBottom: idx < liste.length - 1 ? "1px solid #dde2ea" : "none" }}>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ width: 80, height: 45, position: "relative", borderRadius: 4, overflow: "hidden", background: "#e5e7eb" }}>
                    {e.thumbnailUrl && <Image src={e.thumbnailUrl} alt="" fill style={{ objectFit: "cover" }} sizes="80px" />}
                  </div>
                </td>
                <td style={{ padding: "0.75rem 1rem", maxWidth: 400 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1A1A2E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.titre}</div>
                  <a href={`https://youtu.be/${e.ytVideoId}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--blue)" }}>Voir sur YouTube</a>
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#5a6474", whiteSpace: "nowrap" }}>{e.duree || "—"}</td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#5a6474", whiteSpace: "nowrap" }}>
                  {format(new Date(e.publishedAt), "d MMM yyyy", { locale: fr })}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: e.visible ? "rgba(58,170,53,0.1)" : "rgba(239,68,68,0.1)", color: e.visible ? "var(--green)" : "#ef4444" }}>
                    {e.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {e.visible ? "Visible" : "Masqué"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {liste.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#5a6474" }}>Aucune émission synchronisée.</div>
        )}
      </div>
    </div>
  );
}
