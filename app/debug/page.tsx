import { sqlQuery } from "@/db";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  try {
    const rows = await sqlQuery`SELECT id, titre FROM emissions WHERE visible = true ORDER BY published_at DESC LIMIT 3`;
    return <pre>{JSON.stringify(rows, null, 2)}</pre>;
  } catch (e: any) {
    return <pre>ERR: {e.message}\n\n{e.stack}</pre>;
  }
}
