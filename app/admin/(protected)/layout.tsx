import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Video, Calendar, Newspaper, FileText, MessageSquare, LogOut, Radio } from "lucide-react";
import AdminMobileMenu from "./AdminMobileMenu";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/emissions", label: "Émissions", icon: <Video size={18} /> },
  { href: "/admin/programme", label: "Programme", icon: <Calendar size={18} /> },
  { href: "/admin/articles", label: "Articles", icon: <FileText size={18} /> },
  { href: "/admin/actualites", label: "Actualités", icon: <Newspaper size={18} /> },
  { href: "/admin/messages", label: "Messages", icon: <MessageSquare size={18} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Mobile menu button + overlay */}
      <AdminMobileMenu navItems={navItems} />

      {/* Sidebar desktop */}
      <aside className="hidden md:flex" style={{ width: 240, background: "#14437a", color: "white", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Radio size={22} color="#3AAA35" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Radio HD FM</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Administration</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: 7, fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.85)", textDecoration: "none", transition: "background 0.15s" }} className="admin-nav-link">
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem", paddingLeft: "0.875rem" }}>
            {session.user?.email}
          </div>
          <Link href="/api/auth/signout" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: 7, fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
            <LogOut size={16} /> Déconnexion
          </Link>
        </div>

        <style>{`.admin-nav-link:hover { background: rgba(255,255,255,0.1); color: white; }`}</style>
      </aside>

      <main style={{ marginLeft: 0, flex: 1, padding: "1rem", minHeight: "100vh" }} className="md:ml-60 md:p-8">
        {children}
      </main>

      <style>{`
        @media (min-width: 768px) {
          .md\\:ml-60 { margin-left: 240px; }
          .md\\:p-8 { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
