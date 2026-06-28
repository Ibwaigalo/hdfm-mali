"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, EyeOff, X, Save } from "lucide-react";

interface Article { id?: number; titre: string; contenu: string; imageUrl: string; categorie: string; statut: "publie" | "brouillon"; }
const empty: Article = { titre: "", contenu: "", imageUrl: "", categorie: "", statut: "brouillon" };

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Article>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/admin/articles").then(r => r.json()).then(setArticles);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (a: any) => { setForm({ titre: a.titre, contenu: a.contenu, imageUrl: a.imageUrl || "", categorie: a.categorie || "", statut: a.statut }); setEditId(a.id); setModal(true); };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setLoading(true); setMsg("");
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...form } : form;
      const res = await fetch("/api/admin/articles", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      setModal(false); load();
      setMsg(editId ? "Article modifié." : "Article créé.");
    } catch { setMsg("Erreur lors de la sauvegarde."); }
    finally { setLoading(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch("/api/admin/articles", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#1A1A2E" }}>Articles</h1>
        <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--blue)", color: "white", border: "none", borderRadius: 7, padding: "0.625rem 1.25rem", fontWeight: 700, cursor: "pointer" }}>
          <Plus size={16} /> Nouvel article
        </button>
      </div>

      {msg && <div style={{ padding: "0.75rem 1rem", borderRadius: 7, background: "rgba(58,170,53,0.1)", color: "var(--green)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{msg}</div>}

      <div style={{ background: "white", border: "1px solid #dde2ea", borderRadius: 10, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
              {["Titre", "Catégorie", "Statut", "Date", "Actions"].map(h => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#5a6474", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((a, idx) => (
              <tr key={a.id} style={{ borderBottom: idx < articles.length - 1 ? "1px solid #dde2ea" : "none" }}>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#1A1A2E", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.titre}</td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.85rem", color: "#5a6474" }}>{a.categorie || "—"}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: a.statut === "publie" ? "rgba(58,170,53,0.1)" : "#f3f4f6", color: a.statut === "publie" ? "var(--green)" : "#6b7280" }}>
                    {a.statut === "publie" ? <Eye size={11} /> : <EyeOff size={11} />}
                    {a.statut === "publie" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.82rem", color: "#5a6474", whiteSpace: "nowrap" }}>
                  {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => openEdit(a)} style={{ background: "none", border: "1px solid #dde2ea", borderRadius: 5, padding: "0.3rem 0.6rem", cursor: "pointer", color: "var(--blue)" }}><Edit size={14} /></button>
                    <button onClick={() => del(a.id)} style={{ background: "none", border: "1px solid #dde2ea", borderRadius: 5, padding: "0.3rem 0.6rem", cursor: "pointer", color: "#ef4444" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && <div style={{ padding: "3rem", textAlign: "center", color: "#5a6474" }}>Aucun article. Créez le premier.</div>}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1A1A2E" }}>{editId ? "Modifier l'article" : "Nouvel article"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ name: "titre", label: "Titre *", type: "input" }, { name: "imageUrl", label: "URL de l'image", type: "input" }, { name: "categorie", label: "Catégorie", type: "input" }].map(f => (
                <div key={f.name}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1A1A2E", marginBottom: "0.35rem" }}>{f.label}</label>
                  <input name={f.name} value={(form as any)[f.name]} onChange={handle} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1px solid #dde2ea", borderRadius: 6, fontSize: "0.875rem", color: "#1A1A2E" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1A1A2E", marginBottom: "0.35rem" }}>Contenu *</label>
                <textarea name="contenu" rows={10} value={form.contenu} onChange={handle} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1px solid #dde2ea", borderRadius: 6, fontSize: "0.875rem", resize: "vertical", color: "#1A1A2E" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1A1A2E", marginBottom: "0.35rem" }}>Statut</label>
                <select name="statut" value={form.statut} onChange={handle} style={{ padding: "0.6rem 0.875rem", border: "1px solid #dde2ea", borderRadius: 6, fontSize: "0.875rem", color: "#1A1A2E" }}>
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button onClick={() => setModal(false)} style={{ background: "none", border: "1px solid #dde2ea", borderRadius: 7, padding: "0.6rem 1.25rem", cursor: "pointer", fontWeight: 600, color: "#5a6474" }}>Annuler</button>
                <button onClick={save} disabled={loading || !form.titre || !form.contenu} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--blue)", color: "white", border: "none", borderRadius: 7, padding: "0.6rem 1.25rem", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  <Save size={15} /> {loading ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
