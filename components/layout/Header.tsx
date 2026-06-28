"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Radio } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/journaux", label: "Journaux" },
  { href: "/actualites", label: "Actualités" },
  { href: "/emissions", label: "Émissions" },
  { href: "/blog", label: "Articles" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Fermer au changement de route
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      style={{
        background: "var(--bg-white)",
        borderBottom: "2px solid var(--blue)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 44, height: 44, position: "relative" }}>
            <Image
              src="/logo.png"
              alt="Radio HD FM"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                color: "var(--blue)",
                lineHeight: 1.1,
              }}
            >
              Radio HD FM
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--green)",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              96.00 FM · Bamako
            </div>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--bg-white)" : "var(--text)",
                  background: active ? "var(--blue)" : "transparent",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (!active) { (e.target as HTMLElement).style.background = "var(--bg)"; } }}
                onMouseLeave={(e) => { if (!active) { (e.target as HTMLElement).style.background = "transparent"; } }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bouton écouter desktop */}
        <Link
          href="#player"
          className="hidden md:inline-flex"
          style={{
            background: "var(--green)",
            color: "white",
            padding: "0.5rem 1.25rem",
            borderRadius: 6,
            fontSize: "0.85rem",
            fontWeight: 700,
            gap: "0.4rem",
            alignItems: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "var(--green-dark)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "var(--green)"; }}
        >
          <Radio size={14} /> Écouter
        </Link>

        {/* Hamburger mobile */}
        <button
          className="md:hidden"
          onClick={() => setOpen(true)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Menu"
        >
          <Menu size={24} color="var(--blue)" />
        </button>
      </div>

      {/* Menu mobile - overlay fullscreen */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          visibility: open ? "visible" : "hidden",
          transition: "visibility 0.3s",
        }}
      >
        {/* Backdrop */}
        <div
          onClick={close}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Panneau */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "85%",
            maxWidth: 360,
            background: "var(--bg-white)",
            boxShadow: "-8px 0 30px rgba(0,0,0,0.15)",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* En-tête du panneau */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              color: "var(--blue)",
            }}>
              Menu
            </div>
            <button
              onClick={close}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}
              aria-label="Fermer le menu"
            >
              <X size={24} color="var(--text)" />
            </button>
          </div>

          {/* Liens */}
          <div style={{ padding: "0.75rem 1.5rem", flex: 1 }}>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.9rem 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "1rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "var(--blue)" : "var(--text)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                >
                  {active && (
                    <span style={{
                      width: 4,
                      height: 20,
                      borderRadius: 2,
                      background: "var(--blue)",
                      flexShrink: 0,
                    }} />
                  )}
                  <span style={{ marginLeft: active ? 0 : "1rem" }}>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bouton écouter */}
          <div style={{ padding: "1rem 1.5rem 2rem", borderTop: "1px solid var(--border)" }}>
            <Link
              href="#player"
              onClick={close}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "var(--green)",
                color: "white",
                padding: "0.85rem 1rem",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              <Radio size={18} /> Écouter en direct
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
