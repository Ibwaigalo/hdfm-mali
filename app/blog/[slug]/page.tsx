import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar } from "lucide-react";

export const revalidate = 600;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const result = await db.select({ article: articles, auteur: users })
    .from(articles)
    .leftJoin(users, eq(articles.auteurId, users.id))
    .where(eq(articles.slug, params.slug))
    .limit(1);

  if (!result[0] || result[0].article.statut !== "publie") notFound();
  const { article: a, auteur } = result[0];

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--blue)", fontWeight: 600, marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} /> Retour aux articles
      </Link>

      {a.categorie && (
        <div style={{ display: "inline-block", background: "var(--green)", color: "white", fontSize: "0.75rem", fontWeight: 700, padding: "3px 12px", borderRadius: 4, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{a.categorie}</div>
      )}

      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--text)", lineHeight: 1.3, marginBottom: "1rem" }}>{a.titre}</h1>

      <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Calendar size={14} /> {format(new Date(a.createdAt), "d MMMM yyyy", { locale: fr })}
        </span>
        {auteur?.nom && <span>Par {auteur.nom}</span>}
      </div>

      {a.imageUrl && (
        <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 10, overflow: "hidden", marginBottom: "2rem" }}>
          <Image src={a.imageUrl} alt={a.titre} fill style={{ objectFit: "cover" }} />
        </div>
      )}

      <div style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text)", whiteSpace: "pre-wrap" }}>
        {a.contenu}
      </div>
    </div>
  );
}
