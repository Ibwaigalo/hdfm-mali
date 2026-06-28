import { db } from "../db";
import { articles } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  await db.update(articles).set({
    imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80"
  }).where(eq(articles.slug, "insecurite-alimentaire-mali-plan-national-reponse-2026"));
  console.log("✓ Article 1 mis à jour - marché africain");
  process.exit(0);
}
main().catch(console.error);
