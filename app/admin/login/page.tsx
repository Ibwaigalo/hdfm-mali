"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Radio, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Identifiants incorrects."); setLoading(false); return; }
    router.push("/admin");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #14437a 0%, var(--blue) 100%)", padding: "1.5rem" }}>
      <div style={{ background: "white", borderRadius: 14, padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <Radio size={40} color="var(--blue)" />
          </div>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#1A1A2E" }}>Administration</h1>
          <p style={{ fontSize: "0.875rem", color: "#5a6474", marginTop: "0.25rem" }}>Radio HD FM · Accès réservé</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1A1A2E", marginBottom: "0.35rem" }}>Adresse e-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@hdfm-mali.org" style={{ width: "100%", padding: "0.7rem 0.875rem", border: "1px solid #dde2ea", borderRadius: 7, fontSize: "0.9rem", outline: "none", color: "#1A1A2E" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1A1A2E", marginBottom: "0.35rem" }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={{ width: "100%", padding: "0.7rem 0.875rem", border: "1px solid #dde2ea", borderRadius: 7, fontSize: "0.9rem", outline: "none", color: "#1A1A2E" }} />
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", textAlign: "center" }}>{error}</div>}
          <button onClick={submit} disabled={loading || !email || !password} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "var(--blue)", color: "white", border: "none", borderRadius: 8, padding: "0.8rem", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "0.5rem" }}>
            <LogIn size={18} /> {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
