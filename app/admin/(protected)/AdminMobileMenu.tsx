"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X, Radio } from "lucide-react";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function AdminMobileMenu({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden"
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 60,
          border: "none", background: "var(--blue)", cursor: "pointer",
          padding: 8, borderRadius: 8, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        aria-label="Menu administration"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
          />
          <aside
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 260,
              background: "#14437a", color: "white",
              display: "flex", flexDirection: "column",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Radio size={22} color="#3AAA35" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Radio HD FM</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Administration</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "white", padding: 4 }}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.625rem 0.875rem", borderRadius: 7,
                    fontSize: "0.875rem", fontWeight: 500,
                    color: "rgba(255,255,255,0.85)", textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  className="admin-nav-link"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <Link
                href="/api/auth/signout"
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.625rem 0.875rem", borderRadius: 7,
                  fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", textDecoration: "none",
                }}
              >
                <LogOut size={16} /> Déconnexion
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}