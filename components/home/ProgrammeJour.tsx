import Link from "next/link";
import { Clock } from "lucide-react";

interface ProgrammeItem {
  id: number;
  heureDebut: string;
  heureFin: string;
  titreEmission: string;
  animateur: string | null;
}

function getCurrentTimeStr() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function isCurrentEmission(debut: string, fin: string) {
  const now = getCurrentTimeStr();
  return now >= debut && now < fin;
}

export default function ProgrammeJour({ programme }: { programme: ProgrammeItem[] }) {
  const jourStr = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section style={{ padding: "4rem 1.5rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: "0.25rem",
              }}
            >
              Programme du jour
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 40, height: 3, background: "var(--blue)", borderRadius: 2 }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                {jourStr}
              </span>
            </div>
          </div>
          <Link
            href="/programme"
            style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--blue)" }}
          >
            Programme complet &rarr;
          </Link>
        </div>

        {programme.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
            Le programme de la journée n'a pas encore été renseigné.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 720 }}>
            {programme.slice(0, 6).map((item) => {
              const actif = isCurrentEmission(item.heureDebut, item.heureFin);
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.875rem 1.25rem",
                    borderRadius: 8,
                    background: actif ? "var(--blue)" : "var(--bg-white)",
                    border: actif ? "none" : "1px solid var(--border)",
                    transition: "all 0.15s",
                  }}
                >
                  {/* Heure */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      minWidth: 110,
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={13} color={actif ? "rgba(255,255,255,0.7)" : "var(--text-muted)"} />
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: actif ? "rgba(255,255,255,0.85)" : "var(--text-muted)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.heureDebut} – {item.heureFin}
                    </span>
                  </div>

                  {/* Séparateur */}
                  <div
                    style={{
                      width: 1,
                      height: 32,
                      background: actif ? "rgba(255,255,255,0.2)" : "var(--border)",
                      flexShrink: 0,
                    }}
                  />

                  {/* Titre + animateur */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: actif ? "white" : "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.titreEmission}
                    </div>
                    {item.animateur && (
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: actif ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
                        }}
                      >
                        {item.animateur}
                      </div>
                    )}
                  </div>

                  {/* Badge en cours */}
                  {actif && (
                    <div
                      style={{
                        background: "var(--green)",
                        color: "white",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: 20,
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                      }}
                    >
                      EN COURS
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
