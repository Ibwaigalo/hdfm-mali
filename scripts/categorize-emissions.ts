import { db } from "../db";
import { emissions } from "../db/schema";
import { detectCategory } from "../lib/categories";
import { eq } from "drizzle-orm";

async function main() {
  const all = await db.select().from(emissions);
  let updated = 0;
  for (const e of all) {
    const cat = detectCategory(e.titre);
    if (cat && cat !== e.categorie) {
      await db.update(emissions).set({ categorie: cat }).where(eq(emissions.id, e.id));
      updated++;
      console.log(`  #${e.id} "${e.titre}" → ${cat}`);
    }
  }
  console.log(`\n${updated} émissions catégorisées sur ${all.length}`);
}
main().catch(console.error);
