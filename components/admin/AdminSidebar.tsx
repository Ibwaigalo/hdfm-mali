"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, PlaySquare, CalendarDays, Globe, MessageSquare, FileText, LogOut, Users } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/emissions", label: "Émissions", icon: PlaySquare },
  { href: "/admin/programme", label: "Programme", icon: CalendarDays },
  { href: "/admin/actualites", label: "Actualités", icon: Globe },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        background: "var(--text)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid #2d2d45" }}>
        <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "white" }}>
          Radio HD FM
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--green)", fontWeight: 600 }}>
          Administration
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.875rem",
                borderRadius: 8,
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
                fontWeight: active ? 700 : 500,
                color: active ? "white" : "#9ca3af",
                background: active ? "var(--blue)" : "transparent",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Utilisateur + déconnexion */}
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid #2d2d45" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.875rem", marginBottom: "0.5rem" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "white", fontWeight: 700 }}>
              {user?.name?.[0] || user?.email?.[0] || "A"}
            </span>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "white" }}>{user?.name || "Admin"}</div>
            <div style={{ fontSize: "0.68rem", color: "#6b7280" }}>{user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.875rem",
            borderRadius: 8,
            fontSize: "0.875rem",
            color: "#9ca3af",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
