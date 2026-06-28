"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"] as const;
const JOURS_FR: Record<string, string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche",
};

interface Creneau {
  id: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  titreEmission: string;
  animateur: string | null;
  description: string | null;
}

interface Props {
  initialData: Record<string, Creneau[]>;
}

export default function ProgrammeAdmin({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [activeJour, setActiveJour] = useState<string>("lundi");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    heureDebut: "08:00",
    heureFin: "09:00",
    titreEmission: "",
    animateur: "",
    description: "",
  });

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAdd = async () => {
    if (!form.titreEmission || !form.heureDebut || !form.heureFin) return;
    setSaving(true);
    try {
      const res = await fetch("/api/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jour: activeJour }),
      });
      if (res.ok) {
        const nouveau = await res.json();
        setData((prev) => ({
          ...prev,
          [activeJour]: [...(prev[activeJour] || []), nouveau].sort((a, b) =>
            a.heureDebut.localeCompare(b.heureDebut)
          ),
        }));
        setForm({ heureDebut: "08:00", heureFin: "09:00", titreEmission: "", animateur: "", description: "" });
        setShowForm(false);
        showMsg("success", "Créneau ajouté avec succès.");
      } else {
        showMsg("error", "Erreur lors de l'ajout.");
      }
    } catch {
      showMsg("error", "Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, jour: string) => {
    if (!confirm("Supprimer ce créneau ?")) return;
    try {
      const res = await fetch(`/api/programme/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          [jour]: prev[jour].filter((c) => c.id !== id),
        }));
        showMsg("success", "Créneau supprimé.");
      }
    } catch {
      showMsg("error", "Erreur réseau.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    border: "1px solid var(--border)",
    borderRadius: 6,
    fontSize: "0.85rem",
    color: "var(--text)",
    outline: "none",
    fontFamily: "inherit",
    background: "var(--bg-white)",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1.5rem", alignItems: "start" }}>
      {/* Tabs jours */}
      <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {JOURS.map((jour) => {
          const active = activeJour === jour;
          const count = data[jour]?.length || 0;
          return (
            <button
              key={jour}
              onClick={() => { setActiveJour(jour); setShowForm(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "0.75rem 1rem",
                background: active ? "var(--blue)" : "transparent",
                
                
                
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "0.85rem", fontWeight: active ? 700 : 500, color: active ? "white" : "var(--text)" }}>
                {JOURS_FR[jour]}
              </span>
              {count > 0 && (
                <span style={{ fontSize: "0.7rem", fontWeight: 700, background: active ? "rgba(255,255,255,0.2)" : "var(--bg)", color: active ? "white" : "var(--text-muted)", padding: "1px 7px", borderRadius: 10 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu jour actif */}
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>
            {JOURS_FR[activeJour]}
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--blue)",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "0.5rem 1rem",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Ajouter un créneau
          </button>
        </div>

        {/* Notification */}
        {msg && (
          <div style={{
            padding: "0.75rem 1rem",
            borderRadius: 8,
            marginBottom: "1rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            background: msg.type === "success" ? "rgba(58,170,53,0.1)" : "rgba(220,38,38,0.1)",
            color: msg.type === "success" ? "var(--green)" : "#DC2626",
            border: `1px solid ${msg.type === "success" ? "rgba(58,170,53,0.3)" : "rgba(220,38,38,0.3)"}`,
          }}>
            {msg.text}
          </div>
        )}

        {/* Formulaire ajout */}
        {showForm && (
          <div style={{ background: "var(--bg-white)", border: "1px solid var(--blue)", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>
              Nouveau créneau — {JOURS_FR[activeJour]}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.3rem" }}>Heure début</label>
                <input type="time" value={form.heureDebut} onChange={(e) => setForm({ ...form, heureDebut: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.3rem" }}>Heure fin</label>
                <input type="time" value={form.heureFin} onChange={(e) => setForm({ ...form, heureFin: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.3rem" }}>Titre de l'émission *</label>
              <input type="text" placeholder="Ex: Journal en français" value={form.titreEmission} onChange={(e) => setForm({ ...form, titreEmission: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.3rem" }}>Animateur</label>
              <input type="text" placeholder="Nom de l'animateur" value={form.animateur} onChange={(e) => setForm({ ...form, animateur: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={handleAdd} disabled={saving || !form.titreEmission} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "0.5rem 1.125rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", opacity: !form.titreEmission ? 0.6 : 1 }}>
                <Save size={14} /> {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "0.5rem 1rem", fontSize: "0.85rem", cursor: "pointer", color: "var(--text-muted)" }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste créneaux */}
        <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {(!data[activeJour] || data[activeJour].length === 0) ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Aucun créneau pour ce jour.
            </p>
          ) : (
            data[activeJour].map((creneau) => (
              <div
                key={creneau.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", minWidth: 120, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                  {creneau.heureDebut} – {creneau.heureFin}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{creneau.titreEmission}</div>
                  {creneau.animateur && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{creneau.animateur}</div>}
                </div>
                <button
                  onClick={() => handleDelete(creneau.id, activeJour)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#DC2626", opacity: 0.6, flexShrink: 0 }}
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
