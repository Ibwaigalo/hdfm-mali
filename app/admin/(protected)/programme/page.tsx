"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const JOURS_LABELS: Record<string, string> = { lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi", jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche" };

interface Slot { id?: number; jour: string; heureDebut: string; heureFin: string; titreEmission: string; animateur: string; description: string; }

export default function AdminProgramme() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/programme").then(r => r.json()).then(data => { setSlots(data); setLoading(false); });
  }, []);

  const addSlot = (jour: string) => {
    setSlots([...slots, { jour, heureDebut: "08:00", heureFin: "09:00", titreEmission: "", animateur: "", description: "" }]);
  };

  const update = (idx: number, field: string, val: string) => {
    setSlots(slots.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const remove = (idx: number) => setSlots(slots.filter((_, i) => i !== idx));

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/admin/programme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(slots) });
      if (!res.ok) throw new Error();
      setMsg("Programme sauvegardé avec succès.");
    } catch { setMsg("Erreur lors de la sauvegarde."); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ color: "#5a6474" }}>Chargement...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#1A1A2E" }}>Programme hebdomadaire</h1>
        <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--green)", color: "white", border: "none", borderRadius: 7, padding: "0.625rem 1.25rem", fontWeight: 700, cursor: "pointer" }}>
          <Save size={16} /> {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
      {msg && <div style={{ padding: "0.75rem 1rem", borderRadius: 7, background: msg.includes("succès") ? "rgba(58,170,53,0.1)" : "rgba(239,68,68,0.1)", color: msg.includes("succès") ? "var(--green)" : "#ef4444", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{msg}</div>}

      {JOURS.map((jour) => {
        const jourSlots = slots.map((s, i) => ({ ...s, _idx: i })).filter(s => s.jour === jour);
        return (
          <div key={jour} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1A1A2E" }}>{JOURS_LABELS[jour]}</h2>
              <button onClick={() => addSlot(jour)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--blue)", color: "white", border: "none", borderRadius: 6, padding: "0.4rem 0.875rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                <Plus size={14} /> Ajouter
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {jourSlots.length === 0 && <div style={{ fontSize: "0.85rem", color: "#9ca3af", padding: "0.75rem", background: "white", border: "1px solid #dde2ea", borderRadius: 8 }}>Aucun créneau</div>}
              {jourSlots.map((s) => (
                <div key={s._idx} style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 8, padding: "0.75rem 1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }} className="md:grid-cols-[90px_90px_1fr_1fr_auto] md:items-center">
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input type="time" value={s.heureDebut} onChange={e => update(s._idx, "heureDebut", e.target.value)} style={{ flex: 1, padding: "0.4rem 0.5rem", border: "1px solid #dde2ea", borderRadius: 5, fontSize: "0.85rem", color: "#1A1A2E" }} />
                      <input type="time" value={s.heureFin} onChange={e => update(s._idx, "heureFin", e.target.value)} style={{ flex: 1, padding: "0.4rem 0.5rem", border: "1px solid #dde2ea", borderRadius: 5, fontSize: "0.85rem", color: "#1A1A2E" }} />
                    </div>
                    <input placeholder="Titre de l'émission *" value={s.titreEmission} onChange={e => update(s._idx, "titreEmission", e.target.value)} style={{ padding: "0.4rem 0.75rem", border: "1px solid #dde2ea", borderRadius: 5, fontSize: "0.85rem", color: "#1A1A2E" }} />
                    <input placeholder="Animateur" value={s.animateur} onChange={e => update(s._idx, "animateur", e.target.value)} style={{ padding: "0.4rem 0.75rem", border: "1px solid #dde2ea", borderRadius: 5, fontSize: "0.85rem", color: "#1A1A2E" }} />
                    <button onClick={() => remove(s._idx)} style={{ background: "none", border: "1px solid #fee2e2", borderRadius: 5, cursor: "pointer", color: "#ef4444", padding: "0.4rem 0.75rem", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "center" }}>
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                  <style>{`@media (min-width: 768px) { .md\\:grid-cols-\\[90px_90px_1fr_1fr_auto\\] { grid-template-columns: 90px 90px 1fr 1fr auto; } .md\\:items-center { align-items: center; } }`}</style>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
