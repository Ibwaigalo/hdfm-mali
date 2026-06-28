"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Calendar, Search } from "lucide-react";

interface Emission {
  id: number;
  ytVideoId: string;
  titre: string;
  thumbnailUrl: string | null;
  duree: string | null;
  publishedAt: Date;
  categorie: string | null;
}

export default function EmissionsGrid({ emissions }: { emissions: Emission[] }) {
  const [search, setSearch] = useState("");

  const filtered = emissions.filter((e) =>
    e.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Barre de recherche */}
      <div style={{ position: "relative", maxWidth: 420, marginBottom: "2rem" }}>
        <Search
          size={16}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Rechercher une émission..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.625rem 0.875rem 0.625rem 2.25rem",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: "0.875rem",
            color: "var(--text)",
            background: "var(--bg-white)",
            outline: "none",
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>
          {search ? "Aucun résultat pour cette recherche." : "Aucune émission disponible pour l'instant."}
        </p>
      ) : (
        <>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            {filtered.length} émission{filtered.length > 1 ? "s" : ""}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filtered.map((em) => (
              <EmissionCard key={em.id} emission={em} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function EmissionCard({ emission }: { emission: Emission }) {
  const dateStr = new Date(emission.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/emissions/${emission.ytVideoId}`}
      style={{
        display: "block",
        background: "var(--bg-white)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        textDecoration: "none",
      }}
      className="emission-card"
    >
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
        {emission.thumbnailUrl ? (
          <Image
            src={emission.thumbnailUrl}
            alt={emission.titre}
            fill
            unoptimized
            style={{ objectFit: "cover" }}
            sizes="300px"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={32} color="white" />
          </div>
        )}
        <div className="play-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={20} color="var(--blue)" fill="var(--blue)" />
          </div>
        </div>
        {emission.duree && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.8)", color: "white", fontSize: "0.7rem", fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>
            {emission.duree}
          </div>
        )}
      </div>

      <div style={{ padding: "1rem" }}>
        <h3 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.4, marginBottom: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {emission.titre}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Calendar size={11} />{dateStr}</span>
        </div>
      </div>

      <style>{`.emission-card:hover { box-shadow: 0 8px 24px rgba(26,95,168,0.12); transform: translateY(-2px); } .emission-card:hover .play-overlay { opacity: 1; }`}</style>
    </Link>
  );
}
