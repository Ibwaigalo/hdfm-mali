"use client";

import { useState, useEffect } from "react";

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

function getCurrentMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function toMinutes(h: string): number {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
}

const LABELS: Record<string, string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche",
};

interface Slot {
  id: number;
  heureDebut: string;
  heureFin: string;
  titreEmission: string;
  animateur: string | null;
}

export default function ProgrammeDuJour({ slots }: { slots: Slot[] }) {
  const [now, setNow] = useState(() => getCurrentMinutes());

  useEffect(() => {
    const t = setInterval(() => setNow(getCurrentMinutes()), 30000);
    return () => clearInterval(t);
  }, []);

  if (slots.length === 0) return null;

  const today = LABELS[JOURS[new Date().getDay()]];

  return (
    <section style={{ background: "var(--bg-white)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: "var(--green)" }} />
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--text)" }}>
              Programme du jour
            </h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>
              — {today}
            </span>
          </div>
          <a href="/programme" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--blue)", textDecoration: "none" }}>
            Voir la semaine →
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {slots.map((s) => {
            const debut = toMinutes(s.heureDebut);
            const fin = toMinutes(s.heureFin);
            let status: "passed" | "live" | "upcoming" = "upcoming";
            if (now >= fin) status = "passed";
            else if (now >= debut && now < fin) status = "live";

            return (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "0.65rem 1rem", borderRadius: 8,
                background: status === "live" ? "rgba(58,170,53,0.08)" : "transparent",
                border: status === "live" ? "1px solid rgba(58,170,53,0.25)" : "1px solid transparent",
                opacity: status === "passed" ? 0.5 : 1,
              }}>
                {/* Time */}
                <div style={{ minWidth: 80, fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", fontFamily: "Inter, sans-serif" }}>
                  {s.heureDebut}–{s.heureFin}
                </div>

                {/* Live indicator */}
                {status === "live" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "pulse-live 2s infinite", display: "inline-block" }} />
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.04em" }}>En direct</span>
                  </div>
                )}

                {/* Title + host */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.titreEmission}
                  </div>
                  {s.animateur && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                      {s.animateur}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <style>{`@keyframes pulse-live { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>
    </section>
  );
}
