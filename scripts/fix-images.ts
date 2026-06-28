import { db } from "../db";
import { articles } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  // Fix article 1: insecure alimentaire - revert to working image
  await db.update(articles).set({
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80"
  }).where(eq(articles.slug, "insecurite-alimentaire-mali-plan-national-reponse-2026"));
  console.log("✓ Article 1 fixé");

  // Fix article 3: eau-assainissement - use working African water pump image
  await db.update(articles).set({
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
  }).where(eq(articles.slug, "eau-assainissement-mali-progres-disparites"));
  console.log("✓ Article 3 fixé");

  console.log("Terminé !");
  process.exit(0);
}
main().catch(console.error);
