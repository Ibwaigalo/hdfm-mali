import { NextRequest, NextResponse } from "next/server";
import { syncYouTubeEmissions } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const result = await syncYouTubeEmissions();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Cron YouTube error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
