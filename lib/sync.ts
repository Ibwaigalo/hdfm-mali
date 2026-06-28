import { db } from "@/db";
import { emissions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { syncYouTubeEmissions } from "./youtube";

let syncing = false;

export async function maybeSyncEmissions(): Promise<void> {
  if (syncing) return;

  const last = await db.select({ syncedAt: emissions.syncedAt })
    .from(emissions)
    .orderBy(desc(emissions.syncedAt))
    .limit(1);

  const lastSync = last[0]?.syncedAt;
  const now = new Date();

  if (lastSync && (now.getTime() - new Date(lastSync).getTime() < 3600000)) return;

  syncing = true;
  try {
    await syncYouTubeEmissions();
  } finally {
    syncing = false;
  }
}
