export interface ProgSlot {
  start: string;
  end: string;
  progs: string[];
}

export type DayProg = { label: string; slots: ProgSlot[] };

export const JOURS: { id: string; label: string }[] = [
  { id: "lundi", label: "Lundi" },
  { id: "mardi", label: "Mardi" },
  { id: "mercredi", label: "Mercredi" },
  { id: "jeudi", label: "Jeudi" },
  { id: "vendredi", label: "Vendredi" },
  { id: "samedi", label: "Samedi" },
  { id: "dimanche", label: "Dimanche" },
];

const M = (start: string, end: string, ...progs: string[]): ProgSlot => ({ start, end, progs });

const COMMUN: ProgSlot[] = [
  M("06:00", "06:15", "Ouverture", "Bande Annonce"),
  M("06:15", "07:00", "Messages Essentiels"),
  M("07:30", "08:00", "Tampon Musical / Folklore"),
  M("08:30", "09:00", "Messages Essentiels"),
  M("09:30", "10:00", "Tampon Musical / Folklore"),
  M("10:00", "10:20", "Spot Publicitaires"),
  M("10:20", "11:00", "Baroni"),
  M("12:30", "13:00", "Tampon Musical / Folklore"),
  M("13:30", "14:00", "Messages Essentiels"),
  M("14:00", "14:20", "Spot Publicitaires Humanitaire"),
  M("14:20", "15:00", "Monde Humanitaire"),
  M("15:00", "16:00", "Messages Essentiels"),
  M("16:00", "16:20", "Spot Publicitaires Humanitaire"),
  M("22:00", "23:00", "Monde Humanitaire"),
  M("23:00", "23:45", "Tampon Musical / Folklore"),
  M("23:45", "00:00", "Fin des programmes"),
];

const LUNDI: ProgSlot[] = [
  ...COMMUN,
  M("07:00", "07:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("08:00", "08:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("09:00", "09:30", "Rendez-vous Santé"),
  M("11:00", "12:00", "Concept Humanitaire"),
  M("12:00", "12:30", "Spot Publicitaires"),
  M("13:00", "13:30", "Journaux Humanitaires"),
  M("16:20", "17:00", "Revue Trimestrielle"),
  M("17:00", "18:00", "Parole aux Communautés"),
  M("18:00", "19:00", "Tampon Musical / Folklore"),
  M("19:00", "19:30", "Journaux Humanitaires"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Au cœur des défis"),
  M("21:00", "22:00", "Djamanadew Koumada"),
];

const MARDI: ProgSlot[] = [
  ...COMMUN,
  M("07:00", "07:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("08:00", "08:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("09:00", "09:30", "Rendez-vous Santé"),
  M("11:00", "12:00", "Djamanadew Koumada"),
  M("12:00", "12:30", "Spot Publicitaires"),
  M("13:00", "13:30", "Journaux Humanitaires"),
  M("16:20", "17:00", "Le grand Format"),
  M("17:00", "18:00", "Tampon Musical / Folklore"),
  M("18:00", "19:00", "Parole aux Humanitaire"),
  M("19:00", "19:30", "Journaux Humanitaires"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Djamanadew Koumada"),
  M("21:00", "22:00", "Concept Humanitaire"),
];

const MERCREDI: ProgSlot[] = [
  ...COMMUN,
  M("07:00", "07:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("08:00", "08:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("09:00", "09:30", "Rendez-vous Santé"),
  M("11:00", "12:00", "Concept Humanitaire"),
  M("12:00", "12:30", "Spot Publicitaires"),
  M("13:00", "13:30", "Journaux Humanitaires"),
  M("16:20", "17:00", "Revue Trimestrielle"),
  M("17:00", "18:00", "Parole aux Communautés"),
  M("18:00", "19:00", "Tampon Musical / Folklore"),
  M("19:00", "19:30", "Journaux Humanitaires"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Au cœur des défis"),
  M("21:00", "22:00", "Djamanadew Koumada"),
];

const JEUDI: ProgSlot[] = [
  ...COMMUN,
  M("07:00", "07:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("08:00", "08:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("09:00", "09:30", "Rendez-vous Santé"),
  M("11:00", "12:00", "Djamanadew Koumada"),
  M("12:00", "12:30", "Spot Publicitaires"),
  M("13:00", "13:30", "Journaux Humanitaires"),
  M("16:20", "17:00", "Le grand Format"),
  M("17:00", "18:00", "Tampon Musical / Folklore"),
  M("18:00", "19:00", "Parole aux Humanitaire"),
  M("19:00", "19:30", "Journaux Humanitaires"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Djamanadew Koumada"),
  M("21:00", "22:00", "Concept Humanitaire"),
];

const VENDREDI: ProgSlot[] = [
  ...COMMUN,
  M("07:00", "07:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("08:00", "08:30", "Journaux Humanitaires", "Avis de recrutement"),
  M("09:00", "09:30", "Rendez-vous Santé"),
  M("11:00", "12:00", "Messages Essentiels"),
  M("12:00", "12:30", "Spot Publicitaires"),
  M("13:00", "13:30", "Journaux Humanitaires"),
  M("16:20", "17:00", "Revue Trimestrielle"),
  M("17:00", "18:00", "Parole aux Communautés"),
  M("18:00", "19:00", "Tampon Musical / Folklore"),
  M("19:00", "19:30", "Journaux Humanitaires"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Au cœur des défis"),
  M("21:00", "22:00", "Djamanadew Koumada"),
];

const SAMEDI: ProgSlot[] = [
  M("06:00", "06:15", "Ouverture", "Bande Annonce"),
  M("06:15", "07:00", "Messages Essentiels"),
  M("07:00", "07:30", "Journaux Humanitaires", "Du vendredi"),
  M("07:30", "08:00", "Tampon Musical / Folklore"),
  M("08:00", "08:30", "Journaux Humanitaires", "Du vendredi"),
  M("08:30", "09:00", "Messages Essentiels"),
  M("09:00", "09:30", "Tampon Musical / Folklore"),
  M("09:30", "10:00", "Tampon Musical / Folklore"),
  M("10:00", "10:20", "Spot Publicitaires"),
  M("10:20", "11:00", "Baroni"),
  M("11:00", "12:00", "Concept Humanitaire"),
  M("12:00", "12:30", "Spot Publicitaires"),
  M("12:30", "13:00", "Tampon Musical / Folklore"),
  M("13:00", "13:30", "Journaux Humanitaires", "Du vendredi"),
  M("13:30", "14:00", "Messages Essentiels"),
  M("14:00", "14:20", "Spot Publicitaires Humanitaire"),
  M("14:20", "15:00", "Monde Humanitaire"),
  M("15:00", "16:00", "Messages Essentiels"),
  M("16:00", "16:20", "Spot Publicitaires Humanitaire"),
  M("16:20", "17:00", "Revue Trimestrielle"),
  M("17:00", "18:00", "Tampon Musical / Folklore"),
  M("18:00", "19:00", "Parole aux Humanitaire"),
  M("19:00", "19:30", "Journaux Humanitaires", "Du vendredi"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Djamanadew Koumada"),
  M("21:00", "22:00", "Concept Humanitaire"),
  M("22:00", "23:00", "Monde Humanitaire"),
  M("23:00", "23:45", "Tampon Musical / Folklore"),
  M("23:45", "00:00", "Fin des programmes"),
];

const DIMANCHE: ProgSlot[] = [
  M("06:00", "06:15", "Ouverture", "Bande Annonce"),
  M("06:15", "07:00", "Messages Essentiels"),
  M("07:00", "07:30", "Journaux Humanitaires", "Du vendredi"),
  M("07:30", "08:00", "Tampon Musical / Folklore"),
  M("08:00", "08:30", "Journaux Humanitaires", "Du vendredi"),
  M("08:30", "09:00", "Messages Essentiels"),
  M("09:00", "09:30", "Tampon Musical / Folklore"),
  M("09:30", "10:00", "Tampon Musical / Folklore"),
  M("10:00", "10:20", "Spot Publicitaires"),
  M("10:20", "11:00", "Baroni"),
  M("11:00", "12:00", "Journaux Humanitaires", "Du Lundi"),
  M("12:00", "12:30", "Journaux Humanitaires", "Du mardi"),
  M("12:30", "13:00", "Tampon Musical / Folklore"),
  M("13:00", "13:30", "Journaux Humanitaires", "Du vendredi"),
  M("13:30", "14:00", "Messages Essentiels"),
  M("14:00", "14:20", "Spot Publicitaires Humanitaire"),
  M("14:20", "15:00", "Monde Humanitaire"),
  M("15:00", "16:00", "Journaux Humanitaires", "Du mercredi"),
  M("16:00", "16:20", "Spot Publicitaires Humanitaire"),
  M("16:20", "17:00", "Le grand Format"),
  M("17:00", "18:00", "Journaux Humanitaires", "Du jeudi"),
  M("18:00", "19:00", "Tampon Musical / Folklore"),
  M("19:00", "19:30", "Journaux Humanitaires", "Du vendredi"),
  M("19:30", "20:00", "Magazine « Avis de recrutement »"),
  M("20:00", "21:00", "Au cœur des défis"),
  M("21:00", "22:00", "Djamanadew Koumada"),
  M("22:00", "23:00", "Monde Humanitaire"),
  M("23:00", "23:45", "Tampon Musical / Folklore"),
  M("23:45", "00:00", "Fin des programmes"),
];

export const PROGRAMME: Record<string, DayProg> = {
  lundi: { label: "Lundi", slots: LUNDI },
  mardi: { label: "Mardi", slots: MARDI },
  mercredi: { label: "Mercredi", slots: MERCREDI },
  jeudi: { label: "Jeudi", slots: JEUDI },
  vendredi: { label: "Vendredi", slots: VENDREDI },
  samedi: { label: "Samedi", slots: SAMEDI },
  dimanche: { label: "Dimanche", slots: DIMANCHE },
};

// Couleurs par programme
export const PROG_COLORS: Record<string, string> = {
  "Ouverture": "#64748b",
  "Bande Annonce": "#64748b",
  "Messages Essentiels": "#ec4899",
  "Journaux Humanitaires": "#1A5FA8",
  "Avis de recrutement": "#3AAA35",
  "Du vendredi": "#1A5FA8",
  "Du Lundi": "#1A5FA8",
  "Du mardi": "#1A5FA8",
  "Du mercredi": "#1A5FA8",
  "Du jeudi": "#1A5FA8",
  "Tampon Musical / Folklore": "#d97706",
  "Rendez-vous Santé": "#ef4444",
  "Spot Publicitaires": "#8b5cf6",
  "Spot Publicitaires Humanitaire": "#8b5cf6",
  "Baroni": "#14b8a6",
  "Concept Humanitaire": "#9333ea",
  "Djamanadew Koumada": "#f97316",
  "Monde Humanitaire": "#06b6d4",
  "Revue Trimestrielle": "#6366f1",
  "Le grand Format": "#2563eb",
  "Parole aux Communautés": "#f59e0b",
  "Parole aux Humanitaire": "#3AAA35",
  "Magazine « Avis de recrutement »": "#db2777",
  "Au cœur des défis": "#dc2626",
  "Fin des programmes": "#475569",
};

export function getProgColor(prog: string): string {
  for (const [key, color] of Object.entries(PROG_COLORS)) {
    if (prog.includes(key)) return color;
  }
  return "#6b7280";
}
