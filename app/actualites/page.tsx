import { db } from "@/db";
import { actualites } from "@/db/schema";
import { desc } from "drizzle-orm";
import ActualiteCard from "@/components/actualites/ActualiteCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Actualités humanitaires" };
export const dynamic = 'force-dynamic';
export const revalidate = 1800;

const SOURCES = ["ReliefWeb"];

function getMaliScore(titre: string): number {
  const t = titre.toLowerCase();
  const maliKw = ["mali", "malien", "bamako", "tombouctou", "gao", "mopti", "kidal", "ségou"];
  const subKw = ["burkina", "niger", "mauritanie", "sahel", "g5"];
  if (maliKw.some(kw => t.includes(kw))) return 3;
  if (subKw.some(kw => t.includes(kw))) return 2;
  return 1;
}

export default async function ActualitesPage({ searchParams }: { searchParams: { source?: string } }) {
  const source = searchParams.source;
  const liste = await db.select().from(actualites).orderBy(desc(actualites.publieLe)).limit(60);

  const listeSorted = [...liste].sort((a, b) => {
    const scoreDiff = getMaliScore(b.titre) - getMaliScore(a.titre);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.publieLe || b.fetchedAt).getTime() - new Date(a.publieLe || a.fetchedAt).getTime();
  });

  const filtre = source ? listeSorted.filter((a) => a.source === source) : listeSorted;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>Actualités humanitaires</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Informations en temps réel depuis UNICEF Mali, ReliefWeb, OCHA et UNHCR. Actualisées toutes les 30 minutes.
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
          <a href="/actualites" style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 100, fontSize: "0.82rem", fontWeight: 600, background: !source ? "var(--blue)" : "var(--bg-white)", color: !source ? "white" : "var(--text)", border: "1px solid var(--border)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
            Toutes les sources
          </a>
          {SOURCES.map((s) => (
            <a key={s} href={`/actualites?source=${s}`} style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 100, fontSize: "0.82rem", fontWeight: 600, background: source === s ? "var(--blue)" : "var(--bg-white)", color: source === s ? "white" : "var(--text)", border: "1px solid var(--border)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              {s}
            </a>
          ))}
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
