"use client";

import { useState, useEffect } from "react";

const JOURS_LABELS: Record<string, string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi", jeudi: "Jeudi",
  vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche",
};

function getCurrentDay(): string {
  const days = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
  return days[new Date().getDay()];
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function toMinutes(heure: string): number {
  const [h, m] = heure.split(":").map(Number);
  return h * 60 + m;
}

function getDureeMinutes(debut: string, fin: string): number {
  return toMinutes(fin) - toMinutes(debut);
}

function getSection(heure: string): "matin" | "apres-midi" | "soiree" {
  const m = toMinutes(heure);
  if (m < 12 * 60) return "matin";
  if (m < 18 * 60) return "apres-midi";
  return "soiree";
}

const SECTION_LABELS = {
  "matin": "Matin",
  "apres-midi": "Après-midi",
  "soiree": "Soirée",
};

interface Slot {
  id: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  titreEmission: string;
  animateur?: string | null;
  description?: string | null;
}

interface Props {
  grouped: Record<string, Slot[]>;
  jours: string[];
}

export default function ProgrammeClient({ grouped, jours }: Props) {
  const today = getCurrentDay();
  const [activeDay, setActiveDay] = useState(today);
  const [currentMinutes, setCurrentMinutes] = useState(getCurrentMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinutes(getCurrentMinutes());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const slots = grouped[activeDay] || [];

  // Grouper par section
  const sections: Record<string, Slot[]> = { matin: [], "apres-midi": [], soiree: [] };
  for (const slot of slots) {
    sections[getSection(slot.heureDebut)].push(slot);
  }

  const isLive = (slot: Slot): boolean => {
    if (activeDay !== today) return false;
    const debut = toMinutes(slot.heureDebut);
    const fin = toMinutes(slot.heureFin);
    return currentMinutes >= debut && currentMinutes < fin;
  };

  return (
    <>
      {/* Onglets jours */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "2rem" }}>
        {jours.map((jour) => {
          const isToday = jour === today;
          const isActive = jour === activeDay;
          return (
            <button
              key={jour}
              onClick={() => setActiveDay(jour)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: isActive
                  ? `1.5px solid ${isToday ? "#3AAA35" : "#1A5FA8"}`
                  : "1px solid var(--border)",
                background: isActive
                  ? isToday ? "#3AAA35" : "#1A5FA8"
                  : "var(--bg-white)",
                color: isActive ? "white" : isToday ? "#3AAA35" : "var(--text)",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {JOURS_LABELS[jour]}
              {isToday && (
                <span style={{
                  marginLeft: "6px",
                  fontSize: "0.68rem",
                  opacity: isActive ? 0.85 : 0.7,
                  fontWeight: 500,
                }}>
                  · Aujourd'hui
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu */}
      {slots.length === 0 ? (
        <div style={{
          padding: "3rem",
          textAlign: "center",
          background: "var(--bg-white)",
          borderRadius: 10,
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: "0.9rem",
        }}>
          Aucun créneau pour ce jour.
        </div>
      ) : (
        (["matin", "apres-midi", "soiree"] as const).map((section) => {
          const sectionSlots = sections[section];
          if (sectionSlots.length === 0) return null;
          return (
            <div key={section} style={{ marginBottom: "2rem" }}>
              {/* Label section */}
              <div style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                paddingBottom: "0.5rem",
                marginBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}>
                {SECTION_LABELS[section]}
              </div>

              {/* Slots */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {sectionSlots.map((slot) => {
                  const live = isLive(slot);
                  const duree = getDureeMinutes(slot.heureDebut, slot.heureFin);
                  return (
                    <div
                      key={slot.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "72px 1fr auto",
                        gap: "12px",
                        alignItems: "center",
                        padding: "10px 14px",
                        borderRadius: 8,
                        background: "var(--bg-white)",
                        border: live
                          ? "1.5px solid #3AAA35"
                          : "1px solid var(--border)",
                        borderLeft: live
                          ? "4px solid #3AAA35"
                          : "4px solid transparent",
                        transition: "border 0.2s",
                      }}
                    >
                      {/* Heure */}
                      <div>
                        <div style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: live ? "#3AAA35" : "var(--text)",
                          fontFamily: "Inter, sans-serif",
                        }}>
                          {slot.heureDebut}
                        </div>
                        <div style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}>
                          {duree} min
                        </div>
                      </div>

                      {/* Titre + animateur */}
                      <div>
                        <div style={{
                          fontSize: "0.9rem",
                          fontWeight: live ? 700 : 500,
                          color: "var(--text)",
                          lineHeight: 1.3,
                        }}>
                          {slot.titreEmission}
                        </div>
                        {slot.animateur && (
                          <div style={{
                            fontSize: "0.78rem",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                          }}>
                            {slot.animateur}
                          </div>
                        )}
                        {slot.description && (
                          <div style={{
                            fontSize: "0.78rem",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                          }}>
                            {slot.description}
                          </div>
                        )}
                      </div>

                      {/* Badge durée ou EN COURS */}
                      {live ? (
                        <div style={{
                          background: "#3AAA35",
                          color: "white",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 100,
                          whiteSpace: "nowrap",
                          letterSpacing: "0.04em",
                        }}>
                          En cours
                        </div>
                      ) : (
                        <div style={{
                          background: "var(--bg)",
                          color: "var(--text-muted)",
                          fontSize: "0.75rem",
                          padding: "3px 10px",
                          borderRadius: 100,
                          whiteSpace: "nowrap",
                          border: "1px solid var(--border)",
                        }}>
                          {slot.heureFin}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
