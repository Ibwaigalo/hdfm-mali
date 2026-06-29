"use client";

import { useCallback, useState } from "react";

export default function SyncActualitesButton() {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");

  const sync = useCallback(async () => {
    setStatus("syncing");
    try {
      const r = await fetch("/api/admin/sync-actualites");
      if (!r.ok) throw new Error((await r.json()).error);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, []);

  return (
    <button
      onClick={sync}
      disabled={status === "syncing"}
      style={{
        padding: "0.5rem 1.25rem",
        borderRadius: 8,
        border: "none",
        background: status === "done" ? "var(--green)" : status === "error" ? "#ef4444" : "var(--blue)",
        color: "white",
        fontWeight: 600,
        fontSize: "0.85rem",
        cursor: status === "syncing" ? "not-allowed" : "pointer",
        opacity: status === "syncing" ? 0.6 : 1,
      }}
    >
      {status === "idle" && "Synchroniser ReliefWeb"}
      {status === "syncing" && "Synchronisation..."}
      {status === "done" && "✓ Synchronisé"}
      {status === "error" && "Erreur"}
    </button>
  );
}
