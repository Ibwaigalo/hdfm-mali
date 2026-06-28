import Link from "next/link";
import { Radio } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--text)", color: "white", padding: "3rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Radio size={28} color="var(--green)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: "white" }}>Radio HD FM</div>
                <div style={{ fontSize: "0.75rem", color: "var(--green)" }}>96.00 FM · Bamako</div>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", lineHeight: 1.7, maxWidth: 300, fontStyle: "italic" }}>
              « La voix des communautés au cœur de l'action humanitaire, la voix des humanitaires au service des communautés »
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "white", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Navigation</h4>
            {[{ href: "/journaux", label: "Journaux" }, { href: "/actualites", label: "Actualités" }, { href: "/emissions", label: "Émissions" }, { href: "/blog", label: "Articles" }, { href: "/programme", label: "Programme" }, { href: "/contact", label: "Contact" }].map((link) => (
              <Link key={link.href} href={link.href} style={{ display: "block", fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.5rem" }}>{link.label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "white", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Contact</h4>
            <div style={{ fontSize: "0.875rem", color: "#9ca3af", lineHeight: 2 }}>
              <div>Bamako, Mali</div>
              <div>Fréquence : 96.00 FM</div>
              <a href="https://www.youtube.com/@RadioHumanitéetDéveloppement" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }}>Chaîne YouTube</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #374151", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>&copy; {new Date().getFullYear()} Radio Humanité et Développement HD FM. Tous droits réservés.</p>
          <Link href="/admin" style={{ fontSize: "0.8rem", color: "#6b7280" }}>Administration</Link>
        </div>
      </div>
    </footer>
  );
}
