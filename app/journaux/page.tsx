import { sqlQuery } from "@/db";
import EmissionCard from "@/components/emissions/EmissionCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Journaux" };
export const dynamic = 'force-dynamic';

const LANGUES = [
  { key: "Français", label: "Journal en Français", color: "var(--blue)" },
  { key: "Arabe", label: "Journal en Arabe", color: "#c0392b" },
  { key: "Bambara", label: "Journal en Bambara", color: "var(--green)" },
];

export default async function JournauxPage() {
  const allEmissions = await sqlQuery`SELECT id, yt_video_id as "ytVideoId", titre, description, thumbnail_url as "thumbnailUrl", duree, published_at as "publishedAt", synced_at as "syncedAt", visible, categorie FROM emissions WHERE visible = true ORDER BY published_at DESC LIMIT 100` as any[];

  const grouped: Record<string, any[]> = { Français: [], Arabe: [], Bambara: [] };

  for (const e of allEmissions) {
    const titre = e.titre.toLowerCase();
    if (titre.includes("journal") || titre.includes("jr") || titre.includes("info")) {
      if (titre.includes("arabe") || titre.includes("arabic")) grouped.Arabe.push(e);
      else if (titre.includes("bambara") || titre.includes("bamb")) grouped.Bambara.push(e);
      else grouped.Français.push(e);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>Journaux</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Nos journaux d'information en français, arabe et bambara.
        </p>
      </div>

      {LANGUES.map((lang) => (
        <section key={lang.key} style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 4, height: 28, background: lang.color, borderRadius: 2 }} />
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>{lang.label}</h2>
          </div>
          {grouped[lang.key].length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "1.5rem", background: "var(--bg-white)", borderRadius: 8, border: "1px solid var(--border)" }}>
              Aucun journal disponible pour le moment.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {grouped[lang.key].slice(0, 6).map((e) => (
                <EmissionCard key={e.id} ytVideoId={e.ytVideoId} titre={e.titre} thumbnailUrl={e.thumbnailUrl || ""} duree={e.duree || ""} publishedAt={e.publishedAt} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
