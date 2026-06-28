import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { programme } from "@/db/schema";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await db.select().from(programme);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const slots = await req.json();
    await db.delete(programme);
    if (slots.length > 0) {
      await db.insert(programme).values(
        slots.filter((s: any) => s.titreEmission).map((s: any) => ({
          jour: s.jour,
          heureDebut: s.heureDebut,
          heureFin: s.heureFin,
          titreEmission: s.titreEmission,
          animateur: s.animateur || null,
          description: s.description || null,
        }))
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
