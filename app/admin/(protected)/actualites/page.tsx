import { db } from "@/db";
import { actualites } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

const SOURCE_COLORS: Record<string, string> = { UNICEF: "#00aeef", ReliefWeb: "#ee6300", OCHA: "#009fe3", UNHCR: "#003399", Autre: "#6b7280" };

export default async function AdminActualites() {
  const liste = await db.select().from(actualites).orderBy(desc(actualites.fetchedAt)).limit(100);

  return (
    <div>
      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#1A1A2E", marginBottom: "0.5rem" }}>Actualités humanitaires</h1>
      <p style={{ color: "#5a6474", fontSize: "0.875rem", marginBottom: "2rem" }}>{liste.length} actualités agrégées. Synchronisation automatique toutes les 30 minutes.</p>

      <div style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 10, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 550 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
              {["Source", "Titre", "Date publication", "Récupéré le", "Lien"].map(h => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#5a6474", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {liste.map((a, idx) => (
              <tr key={a.id} style={{ borderBottom: idx < liste.length - 1 ? "1px solid #dde2ea" : "none" }}>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ display: "inline-block", background: SOURCE_COLORS[a.source] || "#6b7280", color: "white", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{a.source}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.85rem", color: "#1A1A2E", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.titre}</td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: "#5a6474", whiteSpace: "nowrap" }}>
                  {a.publieLe ? format(new Date(a.publieLe), "d MMM yyyy", { locale: fr }) : "—"}
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: "#5a6474", whiteSpace: "nowrap" }}>
                  {format(new Date(a.fetchedAt), "d MMM HH:mm", { locale: fr })}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.82rem" }}>
                    <ExternalLink size={13} /> Voir
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {liste.length === 0 && <div style={{ padding: "3rem", textAlign: "center", color: "#5a6474" }}>Aucune actualité. Lancez la synchronisation depuis le tableau de bord.</div>}
      </div>
    </div>
  );
}
