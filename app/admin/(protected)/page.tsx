import { db } from "@/db";
import { emissions, actualites, articles, messagesAuditeurs, messagesContact, programme } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Video, Newspaper, FileText, MessageSquare, Calendar, RefreshCw } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    [emissionsCount],
    [actusCount],
    [articlesCount],
    [messagesCount],
    [contactCount],
    [programmeCount],
  ] = await Promise.all([
    db.select({ count: count() }).from(emissions),
    db.select({ count: count() }).from(actualites),
    db.select({ count: count() }).from(articles),
    db.select({ count: count() }).from(messagesAuditeurs).where(eq(messagesAuditeurs.lu, false)),
    db.select({ count: count() }).from(messagesContact).where(eq(messagesContact.lu, false)),
    db.select({ count: count() }).from(programme),
  ]);

  const stats = [
    { label: "Émissions YouTube", value: emissionsCount.count, icon: <Video size={22} color="var(--blue)" />, href: "/admin/emissions" },
    { label: "Actualités humanitaires", value: actusCount.count, icon: <Newspaper size={22} color="#00aeef" />, href: "/admin/actualites" },
    { label: "Articles publiés", value: articlesCount.count, icon: <FileText size={22} color="var(--green)" />, href: "/admin/articles" },
    { label: "Messages auditeurs (non lus)", value: messagesCount.count, icon: <MessageSquare size={22} color="#f59e0b" />, href: "/admin/messages" },
    { label: "Messages contact (non lus)", value: contactCount.count, icon: <MessageSquare size={22} color="#ef4444" />, href: "/admin/messages" },
    { label: "Créneaux programme", value: programmeCount.count, icon: <Calendar size={22} color="#8b5cf6" />, href: "/admin/programme" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#1A1A2E" }}>Tableau de bord</h1>
        <p style={{ color: "#5a6474", marginTop: "0.25rem", fontSize: "0.875rem" }}>Vue d'ensemble du site Radio HD FM</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {stats.map((s, i) => (
          <a key={i} href={s.href} style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 10, padding: "1.5rem", textDecoration: "none", display: "block", transition: "box-shadow 0.15s" }} className="stat-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              {s.icon}
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#1A1A2E" }}>{s.value}</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#5a6474", fontWeight: 500 }}>{s.label}</div>
          </a>
        ))}
      </div>

      {/* Synchronisation manuelle */}
      <div style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 10, padding: "1.5rem" }}>
        <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", color: "#1A1A2E" }}>Synchronisation manuelle</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <SyncButton label="Synchroniser YouTube" endpoint="/api/cron/youtube" color="var(--blue)" />
          <SyncButton label="Synchroniser actualités" endpoint="/api/cron/rss" color="#00aeef" />
        </div>
      </div>

      <style>{`.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }`}</style>
    </div>
  );
}

function SyncButton({ label, endpoint, color }: { label: string; endpoint: string; color: string }) {
  return (
    <form action={async () => {
      "use server";
      await fetch(`${process.env.NEXTAUTH_URL}${endpoint}`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
    }}>
      <button type="submit" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: color, color: "white", border: "none", borderRadius: 7, padding: "0.625rem 1.25rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
        <RefreshCw size={15} /> {label}
      </button>
    </form>
  );
}
