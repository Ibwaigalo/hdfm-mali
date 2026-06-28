"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NouvelArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titre: "",
    slug: "",
    contenu: "",
    imageUrl: "",
    categorie: "",
    statut: "brouillon" as "brouillon" | "publie",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitre = (titre: string) => {
    setForm({ ...form, titre, slug: slugify(titre) });
  };

  const handleSave = async () => {
    if (!form.titre || !form.contenu) { setError("Titre et contenu requis."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/articles");
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la sauvegarde.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: "0.875rem",
    color: "var(--text)",
    outline: "none",
    fontFamily: "inherit",
    background: "var(--bg-white)",
  };
  const labelStyle = { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.35rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin/articles" style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <ArrowLeft size={15} /> Retour
          </Link>
          <h1 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "1.35rem", fontWeight: 800, color: "var(--text)" }}>Nouvel article</h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => { setForm({ ...form, statut: "brouillon" }); handleSave(); }} disabled={saving} style={{ padding: "0.6rem 1.25rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-white)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "var(--text)" }}>
            Enregistrer brouillon
          </button>
          <button onClick={() => { setForm({ ...form, statut: "publie" }); setTimeout(handleSave, 0); }} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", borderRadius: 8, border: "none", background: "var(--blue)", color: "white", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>
            <Save size={15} /> {saving ? "Sauvegarde..." : "Publier"}
          </button>
        </div>
      </div>

      {error && <p style={{ color: "#DC2626", fontSize: "0.83rem", marginBottom: "1rem", padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }} className="md:grid-cols-[1fr_300px]">
        {/* Contenu principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.5rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Titre *</label>
              <input type="text" placeholder="Titre de l'article" value={form.titre} onChange={(e) => handleTitre(e.target.value)} style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }} />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={{ ...inputStyle, fontSize: "0.82rem", color: "var(--text-muted)" }} />
            </div>
          </div>

          <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.5rem" }}>
            <label style={labelStyle}>Contenu *</label>
            <textarea
              placeholder="Rédigez votre article ici..."
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              rows={18}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Le contenu supporte le Markdown pour la mise en forme.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>Paramètres</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Catégorie</label>
              <input type="text" placeholder="Ex: Humanitaire, Développement" value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Statut</label>
              <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as any })} style={inputStyle}>
                <option value="brouillon">Brouillon</option>
                <option value="publie">Publié</option>
              </select>
            </div>
          </div>

          <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>Image de couverture</h3>
            <input type="url" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} style={inputStyle} />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Aperçu" style={{ width: "100%", borderRadius: 6, marginTop: "0.75rem", aspectRatio: "16/9", objectFit: "cover" }} />
            )}
          </div>
        </div>
      </div>
      <style>{`@media (min-width: 768px) { .md\\:grid-cols-\\[1fr_300px\\] { grid-template-columns: 1fr 300px; } }`}</style>
    </div>
  );
}
