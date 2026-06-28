import { db } from "@/db";
import { messagesAuditeurs, messagesContact } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mic, Mail } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminMessages() {
  const [auditeurs, contacts] = await Promise.all([
    db.select().from(messagesAuditeurs).orderBy(desc(messagesAuditeurs.createdAt)).limit(50),
    db.select().from(messagesContact).orderBy(desc(messagesContact.createdAt)).limit(50),
  ]);

  const TableSection = ({ title, icon, items, fields }: any) => (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1A1A2E", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {icon} {title}
        <span style={{ fontSize: "0.8rem", fontWeight: 600, background: "#e5e7eb", color: "#5a6474", borderRadius: 100, padding: "2px 10px", marginLeft: "0.5rem" }}>{items.length}</span>
      </h2>
      <div style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 10, overflow: "hidden" }}>
        {items.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#5a6474" }}>Aucun message.</div>
        ) : items.map((m: any, idx: number) => (
          <div key={m.id} style={{ padding: "1rem 1.25rem", borderBottom: idx < items.length - 1 ? "1px solid #dde2ea" : "none", background: m.lu ? "transparent" : "rgba(26,95,168,0.03)", borderLeft: m.lu ? "3px solid transparent" : "3px solid var(--blue)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1A1A2E" }}>{m.nom}</span>
                {m.email && <span style={{ fontSize: "0.8rem", color: "#5a6474", marginLeft: "0.75rem" }}>{m.email}</span>}
                {m.sujet && <span style={{ fontSize: "0.8rem", color: "#5a6474", marginLeft: "0.75rem" }}>— {m.sujet}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {!m.lu && <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "var(--blue)", color: "white", borderRadius: 100, padding: "2px 8px" }}>Nouveau</span>}
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>{format(new Date(m.createdAt), "d MMM yyyy HH:mm", { locale: fr })}</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.6 }}>{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#1A1A2E", marginBottom: "2rem" }}>Messages</h1>
      <TableSection title="Messages auditeurs" icon={<Mic size={18} color="var(--green)" />} items={auditeurs} />
      <TableSection title="Messages contact" icon={<Mail size={18} color="var(--blue)" />} items={contacts} />
    </div>
  );
}
