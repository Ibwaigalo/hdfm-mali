import { db } from "../db";
import { programme } from "../db/schema";
import { DATA } from "../data/programme-raw";

async function seedProgramme() {
  const values: (typeof programme.$inferInsert)[] = [];

  for (const { jour, slots } of DATA) {
    for (const slot of slots) {
      // Un slot peut contenir plusieurs émissions (ex: "Journaux Humanitaires" + "Avis de recrutement")
      // On crée un enregistrement par émission
      for (const prog of slot.progs) {
        values.push({
          jour: jour as any,
          heureDebut: slot.start,
          heureFin: slot.end,
          titreEmission: prog,
          animateur: null,
          description: null,
        });
      }
    }
  }

  // Insérer (supprimer l'existant d'abord)
  await db.delete(programme);
  
  // Insérer par lots de 50
  for (let i = 0; i < values.length; i += 50) {
    await db.insert(programme).values(values.slice(i, i + 50));
  }

  console.log(`✅ ${values.length} créneaux insérés dans la table programme.`);
  process.exit(0);
}

seedProgramme().catch((err) => {
  console.error("Erreur seed programme:", err);
  process.exit(1);
});
