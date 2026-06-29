import { db } from "@/db";
import { actualites } from "@/db/schema";
import { desc } from "drizzle-orm";
import ActualiteCard from "@/components/actualites/ActualiteCard";
import { maybeSyncActualites } from "@/lib/sync";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Actualités humanitaires" };
export const dynamic = 'force-dynamic';
export const revalidate = 1800;

const MALI_KW = ["mali", "malien", "bamako", "tombouctou", "gao", "mopti", "kidal", "ségou", "kayes", "sikasso", "ménaka"];

function isMali(titre: string): boolean {
  return MALI_KW.some(kw => titre.toLowerCase().includes(kw));
}

export default async function ActualitesPage({ searchParams }: { searchParams: { region?: string } }) {
  await maybeSyncActualites();
  const region = searchParams.region || "all";
  const liste = await db.select().from(actualites).orderBy(desc(actualites.publieLe)).limit(60);

  const filtre = region === "all" ? liste
    : region === "mali" ? liste.filter(a => isMali(a.titre))
    : liste.filter(a => !isMali(a.titre));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>Actualités humanitaires</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Informations humanitaires agrégées depuis ReliefWeb. Actualisées automatiquement à chaque visite.
        </p>
      </div>

        <div style={{
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          marginBottom: "2rem",
          marginLeft: "-1.5rem",
          marginRight: "-1.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }} className="tabs-scroll">
          <div style={{ display: "flex", gap: "0.5rem", width: "max-content", paddingBottom: "0.5rem" }}>
            <a href="/actualites" style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 100, fontSize: "0.82rem", fontWeight: 600, background: region === "all" ? "var(--blue)" : "var(--bg-white)", color: region === "all" ? "white" : "var(--text)", border: "1px solid var(--border)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              Toutes
            </a>
            <a href="/actualites?region=mali" style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 100, fontSize: "0.82rem", fontWeight: 600, background: region === "mali" ? "var(--blue)" : "var(--bg-white)", color: region === "mali" ? "white" : "var(--text)", border: "1px solid var(--border)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              Mali
            </a>
            <a href="/actualites?region=autres" style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 100, fontSize: "0.82rem", fontWeight: 600, background: region === "autres" ? "var(--blue)" : "var(--bg-white)", color: region === "autres" ? "white" : "var(--text)", border: "1px solid var(--border)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              Autres pays
            </a>
          </div>
        </div>

      {filtre.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-white)", borderRadius: 10, border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          Aucune actualité disponible. La synchronisation s'effectue toutes les 30 minutes.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {filtre.map((a) => (
            <ActualiteCard key={a.id} titre={a.titre} resume={a.resume} imageUrl={a.imageUrl} source={a.source} sourceUrl={a.sourceUrl} publieLe={a.publieLe} />
          ))}
        </div>
      )}
    </div>
  );
}
