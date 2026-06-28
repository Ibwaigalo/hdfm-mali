import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Play, Languages } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Journal {
  ytVideoId: string;
  titre: string;
  thumbnailUrl: string | null;
  duree: string | null;
  publishedAt: Date;
}

interface DerniersJournauxProps {
  francais: Journal | null;
  arabe: Journal | null;
  bambara: Journal | null;
}

const LANGUES = [
  { key: "Français", color: "var(--blue)", border: "#1e6fbf" },
  { key: "Arabe", color: "#c0392b", border: "#e74c3c" },
  { key: "Bambara", color: "var(--green)", border: "#2d8a30" },
] as const;

export default function DerniersJournaux({ francais, arabe, bambara }: DerniersJournauxProps) {
  const journals = { Français: francais, Arabe: arabe, Bambara: bambara };
  const hasAny = francais || arabe || bambara;

  if (!hasAny) return null;

  return (
    <section style={{ background: "var(--bg-white)", padding: "4rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Languages size={20} color="var(--blue)" />
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>
              Derniers journaux
            </h2>
          </div>
          <Link href="/journaux" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--blue)" }}>
            Tous les journaux <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {LANGUES.map((lang) => {
            const j = journals[lang.key];
            return (
              <div key={lang.key} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 3, height: 18, background: lang.color, borderRadius: 2 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: lang.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {lang.key}
                  </span>
                </div>

                {j ? (
                  <Link
                    href={`/emissions/${j.ytVideoId}`}
                    style={{ textDecoration: "none", display: "block", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" }}
                    className="journal-card"
                  >
                    <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
                      {j.thumbnailUrl ? (
                        <Image src={j.thumbnailUrl} alt={j.titre} fill style={{ objectFit: "cover" }} sizes="380px" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: lang.color }}>
                          <Play size={28} color="white" />
                        </div>
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} className="journal-play">
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Play size={18} color={lang.color} fill={lang.color} />
                        </div>
                      </div>
                      {j.duree && (
                        <div style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.8)", color: "white", fontSize: "0.7rem", fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>
                          {j.duree}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "0.75rem 0.9rem" }}>
                      <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.35rem" }}>
                        {j.titre}
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {format(new Date(j.publishedAt), "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <style>{`
                      .journal-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); transform: translateY(-2px); }
                      .journal-card:hover .journal-play { opacity: 1; }
                    `}</style>
                  </Link>
                ) : (
                  <div style={{ border: "1px dashed var(--border)", borderRadius: 10, padding: "2rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    Aucun journal disponible
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
