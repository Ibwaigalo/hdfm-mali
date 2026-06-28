import { syncYouTubeEmissions } from "../lib/youtube";
import { syncActualites } from "../lib/rss";

async function main() {
  console.log("=== Synchronisation YouTube ===");
  try {
    const ytResult = await syncYouTubeEmissions();
    console.log(`YouTube : ${ytResult.added} ajoutées, ${ytResult.skipped} ignorées`);
  } catch (err) {
    console.error("YouTube error:", err);
  }

  console.log("\n=== Synchronisation Actualités RSS ===");
  try {
    const rssResult = await syncActualites();
    console.log(`Actualités : ${rssResult.added} ajoutées, ${rssResult.skipped} ignorées`);
  } catch (err) {
    console.error("RSS error:", err);
  }
}

main().catch(console.error);
