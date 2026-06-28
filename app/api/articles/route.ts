import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { titre, slug, contenu, imageUrl, categorie, statut } = body;

  if (!titre || !contenu || !slug) {
    return NextResponse.json({ error: "Titre, slug et contenu requis" }, { status: 400 });
  }

  try {
    const [article] = await db
      .insert(articles)
      .values({
        titre,
        slug,
        contenu,
        imageUrl: imageUrl || null,
        categorie: categorie || null,
        statut: statut || "brouillon",
        auteurId: parseInt((session.user as any).id),
      })
      .returning();

    return NextResponse.json(article);
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
