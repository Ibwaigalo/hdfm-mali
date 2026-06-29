import { db } from "@/db";
import { actualites } from "@/db/schema";
import { sql } from "drizzle-orm";
import { syncYouTubeEmissions } from "./youtube";
import { syncActualites } from "./rss";

let syncingEmissions = false;
let syncingActualites = false;

export async function maybeSyncEmissions(): Promise<void> {
  if (syncingEmissions) return;

  const last = await db.execute(sql`SELECT synced_at FROM emissions ORDER BY synced_at DESC LIMIT 1`);
  const lastSync = (last.rows as any[])[0]?.synced_at;
  if (lastSync && (Date.now() - new Date(lastSync).getTime() < 3600000)) return;

  syncingEmissions = true;
  try {
    await syncYouTubeEmissions();
  } finally {
    syncingEmissions = false;
  }
}

export async function maybeSyncActualites(): Promise<void> {
  if (syncingActualites) return;

  const last = await db.execute(sql`SELECT fetched_at FROM actualites ORDER BY fetched_at DESC LIMIT 1`);
  const lastSync = (last.rows as any[])[0]?.fetched_at;
  if (lastSync && (Date.now() - new Date(lastSync).getTime() < 1800000)) return;

  syncingActualites = true;
  try {
    await syncActualites();
  } finally {
    syncingActualites = false;
  }
}
