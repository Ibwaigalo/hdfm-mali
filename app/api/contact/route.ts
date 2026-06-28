import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messagesContact } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { nom, email, sujet, message } = await req.json();
    if (!nom || !email || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }
    await db.insert(messagesContact).values({ nom, email, sujet: sujet || null, message });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
