"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";

const STREAM_URL = process.env.NEXT_PUBLIC_ZENO_STREAM_URL || "https://stream.zeno.fm/xxxxxxxxxxxx";

export default function LivePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      audio.src = "";
      setPlaying(false);
    } else {
      setLoading(true);
      audio.src = STREAM_URL;
      audio.volume = volume;
      audio.muted = muted;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        console.error("Erreur lecture stream");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  return (
    <div
      id="player"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--player-height)",
        background: "var(--blue-dark, #14437a)",
        borderTop: "3px solid var(--green)",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: "1.25rem",
        zIndex: 200,
      }}
    >
      <audio ref={audioRef} preload="none" />

      {/* Indicateur live */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: playing ? "var(--green)" : "#6b7280",
            boxShadow: playing ? "0 0 0 3px rgba(58,170,53,0.3)" : "none",
            animation: playing ? "pulse 2s infinite" : "none",
          }}
        />
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: playing ? "var(--green)" : "#9ca3af",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {playing ? "En direct" : "Direct"}
        </span>
      </div>

      {/* Bouton play/pause */}
      <button
        onClick={togglePlay}
        disabled={loading}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--green)",
          border: "none",
          cursor: loading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.15s",
          opacity: loading ? 0.7 : 1,
        }}
        aria-label={playing ? "Mettre en pause" : "Écouter en direct"}
      >
        {loading ? (
          <div
            style={{
              width: 16,
              height: 16,
              border: "2px solid white",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        ) : playing ? (
          <Pause size={18} color="white" fill="white" />
        ) : (
          <Play size={18} color="white" fill="white" />
        )}
      </button>

      {/* Infos radio */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "white",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Radio Humanité et Développement
        </div>
        <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>96.00 FM · Bamako, Mali</div>
      </div>

      {/* Volume (desktop seulement) */}
      <div
        className="hidden sm:flex"
        style={{ alignItems: "center", gap: "0.5rem" }}
      >
        <button
          onClick={toggleMute}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
          aria-label={muted ? "Activer le son" : "Couper le son"}
        >
          {muted ? (
            <VolumeX size={18} color="#9ca3af" />
          ) : (
            <Volume2 size={18} color="white" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={handleVolume}
          style={{ width: 80, accentColor: "var(--green)" }}
          aria-label="Volume"
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
