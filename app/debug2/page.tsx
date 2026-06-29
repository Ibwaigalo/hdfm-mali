import { db } from "@/db";
import { emissions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function Debug2Page() {
  try {
    const rows = await db.select({ id: emissions.id, titre: emissions.titre })
      .from(emissions)
      .where(eq(emissions.visible, true))
      .orderBy(desc(emissions.publishedAt))
      .limit(3);
    return <pre>{JSON.stringify(rows, null, 2)}</pre>;
  } catch (e: any) {
    return <pre>ERR: {e.message}\n\n{e.stack}</pre>;
  }
}
