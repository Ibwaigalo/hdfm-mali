import { db } from "../db";
import { articles } from "../db/schema";

async function main() {
  const rows = await db.select({ slug: articles.slug, image: articles.imageUrl, titre: articles.titre }).from(articles);
  for (const r of rows) {
    console.log(`${r.slug}`);
    console.log(`  ${r.titre?.substring(0, 60)}`);
    console.log(`  ${r.image}`);
  }
  process.exit(0);
}
main().catch(console.error);
