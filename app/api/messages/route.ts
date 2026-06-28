import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messagesAuditeurs } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { nom, email, message } = await req.json();
    if (!nom || !message) {
      return NextResponse.json({ error: "Nom et message requis" }, { status: 400 });
    }
    await db.insert(messagesAuditeurs).values({ nom, email: email || null, message });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
