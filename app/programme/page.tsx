import { db } from "@/db";
import { programme } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import ProgrammeClient from "@/components/programme/ProgrammeClient";

export const metadata: Metadata = { title: "Programme des émissions" };
export const revalidate = 3600;

const JOURS = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"] as const;

export default async function ProgrammePage() {
  const grille = await db
    .select()
    .from(programme)
    .orderBy(asc(programme.heureDebut));

  const grouped: Record<string, typeof grille> = {};
  for (const jour of JOURS) grouped[jour] = [];
  for (const slot of grille) {
    if (grouped[slot.jour]) grouped[slot.jour].push(slot);
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>
          Programme des émissions
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
          Grille hebdomadaire · Radio HD FM · Heure de Bamako (UTC+0)
        </p>
      </div>

      <ProgrammeClient grouped={grouped} jours={[...JOURS]} />
    </div>
  );
}
