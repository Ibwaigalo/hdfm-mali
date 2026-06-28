import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { titre, contenu, imageUrl, categorie, statut } = await req.json();
    if (!titre || !contenu) return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    const slug = titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
    const [article] = await db.insert(articles).values({ titre, slug, contenu, imageUrl: imageUrl || null, categorie: categorie || null, statut: statut || "brouillon" }).returning();
    return NextResponse.json(article);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { id, titre, contenu, imageUrl, categorie, statut } = await req.json();
    await db.update(articles).set({ titre, contenu, imageUrl: imageUrl || null, categorie: categorie || null, statut, updatedAt: new Date() }).where(eq(articles.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await req.json();
  await db.delete(articles).where(eq(articles.id, id));
  return NextResponse.json({ success: true });
}
