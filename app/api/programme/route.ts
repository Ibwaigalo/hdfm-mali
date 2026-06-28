import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { programme } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { jour, heureDebut, heureFin, titreEmission, animateur, description } = body;

  if (!jour || !heureDebut || !heureFin || !titreEmission) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  try {
    const [creneau] = await db
      .insert(programme)
      .values({
        jour,
        heureDebut,
        heureFin,
        titreEmission,
        animateur: animateur || null,
        description: description || null,
      })
      .returning();

    return NextResponse.json(creneau);
  } catch (error) {
    console.error("Erreur programme POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
