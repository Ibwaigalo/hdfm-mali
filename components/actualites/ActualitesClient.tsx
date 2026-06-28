"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Actu {
  id: number;
  titre: string;
  resume: string | null;
  imageUrl: string | null;
  source: string;
  sourceUrl: string;
  publieLe: Date | null;
}

const SOURCE_COLORS: Record<string, string> = {
  UNICEF: "#00aeef",
  ReliefWeb: "#e63529",
  OCHA: "#009edb",
  UNHCR: "#00b398",
  Autre: "#6b7280",
};

const SOURCES = ["Toutes", "UNICEF", "ReliefWeb", "OCHA", "UNHCR"];

export default function ActualitesClient({ actualites }: { actualites: Actu[] }) {
  const [activeSource, setActiveSource] = useState("Toutes");

  const filtered =
    activeSource === "Toutes"
      ? actualites
      : actualites.filter((a) => a.source === activeSource);

  return (
    <>
      {/* Filtres */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {SOURCES.map((src) => {
          const active = activeSource === src;
          const color = SOURCE_COLORS[src] || "var(--blue)";
          return (
            <button
              key={src}
              onClick={() => setActiveSource(src)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 20,
                border: `2px solid ${active ? color : "var(--border)"}`,
                background: active ? color : "var(--bg-white)",
                color: active ? "white" : "var(--text)",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {src}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        {filtered.length} article{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>
          Aucune actualité disponible pour cette source.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((actu) => (
            <ActuCard key={actu.id} actu={actu} />
          ))}
        </div>
      )}
    </>
  );
}

function ActuCard({ actu }: { actu: Actu }) {
  const sourceColor = SOURCE_COLORS[actu.source] || SOURCE_COLORS.Autre;
  const dateStr = actu.publieLe
    ? new Date(actu.publieLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <a
      href={actu.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-white)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        textDecoration: "none",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      className="actu-card"
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb", flexShrink: 0 }}>
        {actu.imageUrl ? (
          <Image src={actu.imageUrl} alt={actu.titre} fill style={{ objectFit: "cover" }} sizes="340px" />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `${sourceColor}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: sourceColor, opacity: 0.35 }}>{actu.source}</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, background: sourceColor, color: "white", fontSize: "0.65rem", fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>
          {actu.source}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: "1.1rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.45, marginBottom: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {actu.titre}
        </h3>
        {actu.resume && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.75rem", flex: 1 }}>
            {actu.resume}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          {dateStr && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{dateStr}</span>}
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "var(--blue)", fontWeight: 700 }}>
            <ExternalLink size={11} /> Lire la source
          </span>
        </div>
      </div>

      <style>{`.actu-card:hover { box-shadow: 0 8px 24px rgba(26,95,168,0.1); transform: translateY(-2px); }`}</style>
    </a>
  );
}
