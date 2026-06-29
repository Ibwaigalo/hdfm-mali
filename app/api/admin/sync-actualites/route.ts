import { NextResponse } from "next/server";
import { syncActualites } from "@/lib/rss";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await syncActualites();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
