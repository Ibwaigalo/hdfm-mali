import { db } from "../db";
import { articles } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  await db.update(articles).set({
    imageUrl: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800&q=80"
  }).where(eq(articles.slug, "education-crise-mali-ecoles-fermees-enfants-prives-classe"));
  console.log("✓ Article 5 - education image mise à jour (enfants africains)");
  process.exit(0);
}
main().catch(console.error);
