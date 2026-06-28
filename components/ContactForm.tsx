"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.message) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ nom: "", email: "", sujet: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <CheckCircle size={48} color="var(--green)" style={{ marginBottom: "1rem" }} />
        <h3 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: "0.5rem" }}>
          Message envoyé
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais.
        </p>
        <button onClick={() => setStatus("idle")} style={{ marginTop: "1.25rem", background: "var(--blue)", color: "white", border: "none", borderRadius: 6, padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>
          Nouveau message
        </button>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: "0.875rem",
    color: "var(--text)",
    background: "var(--bg-white)",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "0.35rem",
  };

  return (
    <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 12, padding: "2rem" }}>
      <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem" }}>
        Envoyer un message
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={labelStyle}>Nom *</label>
          <input type="text" placeholder="Votre nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input type="email" placeholder="votre@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Sujet</label>
        <input type="text" placeholder="Objet de votre message" value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })} style={inputStyle} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Message *</label>
        <textarea
          placeholder="Votre message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      {status === "error" && (
        <p style={{ color: "#DC2626", fontSize: "0.83rem", marginBottom: "1rem" }}>
          Une erreur s'est produite. Veuillez réessayer.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === "loading" || !form.nom || !form.email || !form.message}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          background: "var(--blue)",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "0.875rem",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: status === "loading" ? "wait" : "pointer",
          opacity: (!form.nom || !form.email || !form.message) ? 0.6 : 1,
        }}
      >
        <Send size={16} />
        {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </div>
  );
}
