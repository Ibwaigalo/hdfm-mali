export interface CategoryDef {
  id: string;
  label: string;
  color: string;
  detect: (titre: string) => boolean;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "journaux", label: "Journaux", color: "var(--blue)", detect: (t) => /journal/i.test(t) },
  { id: "parole-aux-humanitaires", label: "Parole aux humanitaires", color: "#3AAA35", detect: (t) => /paroles?\s*aux\s*humanitaire/i.test(t) },
  { id: "paroles-aux-communautes", label: "Paroles aux communautés", color: "#f59e0b", detect: (t) => /paroles?\s*aux\s*communaut/i.test(t) },
  { id: "monde-humanitaire", label: "Monde humanitaire", color: "#00aeef", detect: (t) => /monde humanitaire/i.test(t) },
  { id: "rendez-vous-sante", label: "Rendez-vous santé", color: "#ef4444", detect: (t) => /rendez-?vous sant|sant. plus/i.test(t) },
  { id: "concept-humanitaire", label: "Concept humanitaire", color: "#8b5cf6", detect: (t) => /concept\s*humanitaire/i.test(t) },
  { id: "messages-essentiels", label: "Messages essentiels", color: "#ec4899", detect: (t) => /messages? essentiel|avis de recrutement|flash/i.test(t) },
  { id: "hd-fm-ka-baroni", label: "HD FM Ka baroni", color: "#14b8a6", detect: (t) => /ka baroni/i.test(t) },
  { id: "djamanadenw-ka-koumada", label: "Djamanadenw ka koumada", color: "#f97316", detect: (t) => /djamanadenw|djamanadew|jamanadenw|jamadew/i.test(t) },
  { id: "grand-format", label: "Grand Format", color: "#6366f1", detect: (t) => /grand format/i.test(t) },
  { id: "aux-coeurs-des-defis", label: "Aux Coeurs des défis", color: "#dc2626", detect: (t) => /coeurs? des d.fis|d.fis/i.test(t) },
  { id: "revue-humanitaire", label: "Revue Humanitaire", color: "#0891b2", detect: (t) => /revue humanitaire/i.test(t) },
];

export function detectCategory(titre: string): string | null {
  for (const cat of CATEGORIES) {
    if (cat.detect(titre)) return cat.id;
  }
  return null;
}

export function getCategory(id: string | null): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
