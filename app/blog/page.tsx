import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Articles" };
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const liste = await db.select({ article: articles, auteur: users })
    .from(articles)
    .leftJoin(users, eq(articles.auteurId, users.id))
    .where(eq(articles.statut, "publie"))
    .orderBy(desc(articles.createdAt))
    .limit(30);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>Articles</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Actualités, reportages et informations de Radio HD FM.</p>
      </div>

      {liste.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-white)", borderRadius: 10, border: "1px solid var(--border)", color: "var(--text-muted)" }}>Aucun article publié pour le moment.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {liste.map(({ article: a, auteur }) => (
            <Link key={a.id} href={`/blog/${a.slug}`} style={{ display: "block", background: "var(--bg-white)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", textDecoration: "none", transition: "box-shadow 0.2s, transform 0.2s" }} className="article-card">
              <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
                {a.imageUrl ? (
                  <Image src={a.imageUrl} alt={a.titre} fill style={{ objectFit: "cover" }} sizes="400px" />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--blue) 0%, #14437a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontWeight: 800, fontSize: "1.25rem" }}>HD FM</span>
                  </div>
                )}
                {a.categorie && (
                  <div style={{ position: "absolute", top: 8, left: 8, background: "var(--green)", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "2px 10px", borderRadius: 4 }}>{a.categorie}</div>
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.4, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.titre}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {format(new Date(a.createdAt), "d MMM yyyy", { locale: fr })}
                  </span>
                  {auteur?.nom && <span>Par {auteur.nom}</span>}
                </div>
              </div>
              <style>{`.article-card:hover { box-shadow: 0 4px 20px rgba(26,95,168,0.12); transform: translateY(-2px); }`}</style>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
