"use client";

import { Radio, Play } from "lucide-react";

export default function HeroSection() {
  const scrollToPlayer = () => {
    document.getElementById("player")?.scrollIntoView({ behavior: "smooth" });
    // Déclenche le play via un event custom
    window.dispatchEvent(new CustomEvent("hdfm:play"));
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, var(--blue-dark, #14437a) 0%, var(--blue) 60%, #1a6ab8 100%)",
        padding: "5rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cercles décoratifs sobres */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
        {/* Badge live */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(58,170,53,0.15)",
            border: "1px solid var(--green)",
            borderRadius: 20,
            padding: "0.35rem 1rem",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "0.78rem", color: "var(--green)", fontWeight: 700, letterSpacing: "0.06em" }}>
            EN DIRECT · 96.00 FM
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            color: "white",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
          }}
        >
          Radio Humanité
          <br />
          <span style={{ color: "var(--green)" }}>et Développement</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.125rem)",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.75,
            marginBottom: "2.5rem",
            maxWidth: 560,
            margin: "0 auto 2.5rem",
          }}
        >
          La voix de l'action humanitaire au Mali. Émissions, journaux multilingues et actualités en temps réel depuis Bamako.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={scrollToPlayer}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--green)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "0.875rem 2rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            <Play size={18} fill="white" />
            Écouter en direct
          </button>
          <a
            href="/emissions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              color: "white",
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: 8,
              padding: "0.875rem 2rem",
              fontSize: "1rem",
              fontWeight: 600,
              transition: "border-color 0.15s",
            }}
          >
            Voir les émissions
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
