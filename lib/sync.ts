import { sqlQuery } from "@/db";
import { syncYouTubeEmissions } from "./youtube";
import { syncActualites } from "./rss";

let syncingEmissions = false;
let syncingActualites = false;

export async function maybeSyncEmissions(): Promise<void> {
  if (syncingEmissions) return;

  const rows = await sqlQuery`SELECT synced_at FROM emissions ORDER BY synced_at DESC LIMIT 1` as any[];
  const lastSync = rows[0]?.synced_at;
  if (lastSync && (Date.now() - new Date(lastSync).getTime() < 3600000)) return;

  syncingEmissions = true;
  try {
    await syncYouTubeEmissions();
  } catch (e) {
    console.error("Sync emissions error:", e);
  } finally {
    syncingEmissions = false;
  }
}

export async function maybeSyncActualites(): Promise<void> {
  if (syncingActualites) return;

  const rows = await sqlQuery`SELECT fetched_at FROM actualites ORDER BY fetched_at DESC LIMIT 1` as any[];
  const lastSync = rows[0]?.fetched_at;
  if (lastSync && (Date.now() - new Date(lastSync).getTime() < 1800000)) return;

  syncingActualites = true;
  try {
    await syncActualites();
  } catch (e) {
    console.error("Sync actualites error:", e);
  } finally {
    syncingActualites = false;
  }
}
