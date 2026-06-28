import { NextRequest, NextResponse } from "next/server";
import { syncActualites } from "@/lib/rss";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const result = await syncActualites();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Cron RSS error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
