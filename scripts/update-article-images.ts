import { db } from "../db";
import { articles } from "../db/schema";
import { eq } from "drizzle-orm";

const updates: { slug: string; imageUrl: string }[] = [
  {
    slug: "insecurite-alimentaire-mali-plan-national-reponse-2026",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80", // Sahel food distribution
  },
  {
    slug: "sante-mali-vaccination-sante-maternelle-nord",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80", // African health worker
  },
  {
    slug: "eau-assainissement-mali-progres-disparites",
    imageUrl: "https://images.unsplash.com/photo-1536913543561-7c0d062ee4c4?w=800&q=80", // African woman fetching water
  },
  {
    slug: "femmes-rurales-mali-cooperatives-agricoles-autonomisation",
    imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80", // African woman farmer
  },
  {
    slug: "education-crise-mali-ecoles-fermees-enfants-prives-classe",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", // African children school
  },
];

async function main() {
  for (const u of updates) {
    await db.update(articles).set({ imageUrl: u.imageUrl }).where(eq(articles.slug, u.slug));
    console.log(`✓ Mis à jour : ${u.slug}`);
  }
  console.log("Terminé !");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
