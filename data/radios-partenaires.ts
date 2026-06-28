export interface RadioPartenaire {
  ville: string;
  nom: string;
  frequence: string;
  zone: string;
}

export const RADIOS_PARTENAIRES: RadioPartenaire[] = [
  { ville: "Bandiagara", nom: "Kanda", frequence: "92.4", zone: "Centre" },
  { ville: "Douentza", nom: "Daande", frequence: "107.7", zone: "Centre" },
  { ville: "Gao", nom: "Koima", frequence: "88.6", zone: "Nord" },
  { ville: "Kayes", nom: "Sahel", frequence: "98.2", zone: "Ouest" },
  { ville: "Kidal", nom: "Tisdas", frequence: "91.0", zone: "Nord" },
  { ville: "Koulikoro", nom: "I D", frequence: "99.9", zone: "Sud" },
  { ville: "Koro", nom: "Sindjère", frequence: "95.6", zone: "Centre" },
  { ville: "Ménaka", nom: "Aadar", frequence: "91.9", zone: "Nord" },
  { ville: "Niono", nom: "Tiésiri", frequence: "89.0", zone: "Centre" },
  { ville: "Ségou", nom: "Foko", frequence: "100.8", zone: "Centre" },
  { ville: "Sévaré", nom: "Kounari", frequence: "105.4", zone: "Centre" },
  { ville: "Sikasso", nom: "Bendé", frequence: "99.5", zone: "Sud" },
  { ville: "Tombouctou", nom: "Jamana", frequence: "91.4", zone: "Nord" },
];

export const ZONES = ["Nord", "Centre", "Ouest", "Sud"] as const;

export const ZONE_COLORS: Record<string, string> = {
  Nord: "#06b6d4",
  Centre: "#f59e0b",
  Ouest: "#3AAA35",
  Sud: "#1A5FA8",
};
