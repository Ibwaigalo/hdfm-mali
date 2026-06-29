import { sqlQuery } from "@/db";
import EmissionCard from "@/components/emissions/EmissionCard";
import { CATEGORIES, getCategory } from "@/lib/categories";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Émissions" };
export const dynamic = 'force-dynamic';

export default async function EmissionsPage({ searchParams }: { searchParams: { cat?: string } }) {
  const activeCat = searchParams.cat || "all";

  const allEmissions = await sqlQuery`SELECT id, yt_video_id as "ytVideoId", titre, description, thumbnail_url as "thumbnailUrl", duree, published_at as "publishedAt", synced_at as "syncedAt", visible, categorie FROM emissions WHERE visible = true ORDER BY published_at DESC LIMIT 300` as any[];

  const grouped: Record<string, typeof allEmissions> = {};
  for (const e of allEmissions) {
    const key = e.categorie || "autres";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }

  const displayEmissions = activeCat === "all" ? allEmissions : (grouped[activeCat] || []);

  const tabs: { id: string; label: string; count: number; color: string }[] = [
    { id: "all", label: "Toutes", count: allEmissions.length, color: "var(--blue)" },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      count: grouped[c.id]?.length || 0,
      color: c.color,
    })),
    ...(grouped["autres"] ? [{ id: "autres", label: "Autres", count: grouped["autres"].length, color: "#6b7280" }] : []),
  ].filter((t) => t.count > 0 || t.id === "all");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>Émissions</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Toutes nos émissions en replay — classées par thématique.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {tabs.map((tab) => {
          const isActive = activeCat === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.id === "all" ? "/emissions" : `/emissions?cat=${tab.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: 100,
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                background: isActive ? (tab.color || "var(--blue)") : "var(--bg-white)",
                color: isActive ? "white" : "var(--text-muted)",
                border: isActive ? "none" : "1px solid var(--border)",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                background: isActive ? "rgba(255,255,255,0.2)" : "var(--bg)",
                color: isActive ? "white" : "var(--text-muted)",
                borderRadius: 100,
                padding: "1px 8px",
              }}>
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {displayEmissions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-white)", borderRadius: 10, border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          Aucune émission dans cette catégorie.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {displayEmissions.map((e) => (
            <EmissionCard key={e.id} ytVideoId={e.ytVideoId} titre={e.titre} thumbnailUrl={e.thumbnailUrl || ""} duree={e.duree || ""} publishedAt={e.publishedAt} categorie={getCategory(e.categorie)?.label || e.categorie || undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
