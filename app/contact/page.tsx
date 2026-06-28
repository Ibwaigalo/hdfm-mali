"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Send, Mic } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Erreur serveur");
      setSuccess(true);
      setForm({ nom: "", email: "", sujet: "", message: "" });
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>Nous contacter</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Envoyez-nous un message ou retrouvez-nous à Bamako.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
        {/* Formulaire */}
        <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 12, padding: "2rem" }}>
          <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem", color: "var(--text)" }}>Envoyer un message</h2>

          {success ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--green)" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Message envoyé</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Nous vous répondrons dans les meilleurs délais.</p>
              <button onClick={() => setSuccess(false)} style={{ marginTop: "1rem", background: "var(--blue)", color: "white", border: "none", borderRadius: 6, padding: "0.6rem 1.25rem", cursor: "pointer", fontWeight: 600 }}>Nouveau message</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ name: "nom", label: "Nom complet", type: "text", required: true }, { name: "email", label: "Adresse e-mail", type: "email", required: true }, { name: "sujet", label: "Sujet", type: "text", required: false }].map((f) => (
                <div key={f.name}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.35rem" }}>{f.label}{f.required && " *"}</label>
                  <input name={f.name} type={f.type} value={(form as any)[f.name]} onChange={handle} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1px solid var(--border)", borderRadius: 6, fontSize: "0.875rem", outline: "none", color: "var(--text)", background: "var(--bg)" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.35rem" }}>Message *</label>
                <textarea name="message" rows={5} value={form.message} onChange={handle} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1px solid var(--border)", borderRadius: 6, fontSize: "0.875rem", resize: "vertical", outline: "none", color: "var(--text)", background: "var(--bg)" }} />
              </div>
              {error && <div style={{ color: "#dc2626", fontSize: "0.85rem" }}>{error}</div>}
              <button onClick={submit} disabled={loading || !form.nom || !form.email || !form.message} style={{ background: "var(--blue)", color: "white", border: "none", borderRadius: 8, padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.7 : 1 }}>
                <Send size={16} /> {loading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </div>
          )}
        </div>

        {/* Infos + Espace auditeurs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 12, padding: "2rem" }}>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--text)" }}>Nos coordonnées</h2>
            {[
              { icon: <MapPin size={18} color="var(--blue)" />, label: "Adresse", value: "Bamako, Mali" },
              { icon: <Phone size={18} color="var(--blue)" />, label: "Fréquence", value: "96.00 FM" },
              { icon: <Mail size={18} color="var(--blue)" />, label: "Site web", value: "hdfm-mali.org" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Espace auditeurs */}
          <AuditeurForm />
        </div>
      </div>
    </div>
  );
}

function AuditeurForm() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    try {
      await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, var(--green) 0%, #2a8026 100%)", borderRadius: 12, padding: "2rem", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <Mic size={20} />
        <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>Espace auditeurs</h2>
      </div>
      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", marginBottom: "1.25rem" }}>Partagez vos réactions, idées et suggestions avec notre équipe.</p>
      {success ? (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <div style={{ fontWeight: 700 }}>Message reçu, merci !</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[{ name: "nom", placeholder: "Votre nom", type: "text" }, { name: "email", placeholder: "Votre e-mail (optionnel)", type: "email" }].map((f) => (
            <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder} value={(form as any)[f.name]} onChange={handle} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, fontSize: "0.875rem", background: "rgba(255,255,255,0.15)", color: "white", outline: "none" }} />
          ))}
          <textarea name="message" rows={3} placeholder="Votre message..." value={form.message} onChange={handle} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, fontSize: "0.875rem", background: "rgba(255,255,255,0.15)", color: "white", resize: "none", outline: "none" }} />
          <button onClick={submit} disabled={loading || !form.nom || !form.message} style={{ background: "white", color: "var(--green)", border: "none", borderRadius: 6, padding: "0.7rem 1.25rem", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Envoi..." : "Envoyer mon message"}
          </button>
        </div>
      )}
    </div>
  );
}
