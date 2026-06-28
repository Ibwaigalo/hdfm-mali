"use client";

import { RADIOS_PARTENAIRES, ZONE_COLORS } from "@/data/radios-partenaires";
import { Radio, MapPin } from "lucide-react";

const ZONE_COLORS_BG: Record<string, string> = {
  Nord: "#06b6d420",
  Centre: "#f59e0b20",
  Ouest: "#3AAA3520",
  Sud: "#1A5FA820",
};

export default function RadiosMarquee() {
  const cards = RADIOS_PARTENAIRES.map((r) => {
    const color = ZONE_COLORS[r.zone] || "#6b7280";
    const bg = r.zone ? `${color}12` : "#f3f4f6";
    return { ...r, color, bg };
  });

  // Dupliquer pour l'effet de boucle continue
  const items = [...cards, ...cards, ...cards];

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        padding: "2rem 0",
      }}
      className="marquee-container"
    >
      <div className="marquee-track" style={{ display: "flex", gap: "1rem", width: "max-content" }}>
        {items.map((radio, i) => (
          <div
            key={`${radio.ville}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              padding: "1rem 1.5rem",
              borderRadius: 12,
              background: "var(--bg-white)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              flexShrink: 0,
              width: 320,
              transition: "box-shadow 0.2s",
            }}
            className="marquee-card"
          >
            {/* Icône radio */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: radio.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: radio.color,
                flexShrink: 0,
              }}
            >
              <Radio size={20} />
            </div>

            {/* Infos */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Zone badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: radio.color,
                  background: radio.bg,
                  padding: "2px 8px",
                  borderRadius: 100,
                  marginBottom: "4px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {radio.zone}
              </div>
              {/* Nom */}
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text)",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Radio {radio.nom}
              </div>
              {/* Ville */}
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  marginTop: "2px",
                }}
              >
                <MapPin size={11} />
                {radio.ville}
              </div>
            </div>

            {/* Fréquence */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: radio.color,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {radio.frequence}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, marginTop: "2px" }}>
                MHz
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-320px * 13 - 1rem * 12)); }
        }
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
