import Parser from "rss-parser";
import { db } from "@/db";
import { actualites } from "@/db/schema";
import { eq } from "drizzle-orm";

const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "enclosure", "content:encoded"],
  },
});

interface RssSource {
  name: "ReliefWeb";
  url: string;
  forceMali: boolean;
}

const RSS_SOURCES: RssSource[] = [
  { name: "ReliefWeb", url: "https://reliefweb.int/country/mli/rss.xml", forceMali: true },
  { name: "ReliefWeb", url: "https://reliefweb.int/country/bfa/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/country/ner/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/country/mrt/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/updates/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/organization/ocha/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/organization/unicef/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/organization/unhcr/rss.xml", forceMali: false },
  { name: "ReliefWeb", url: "https://reliefweb.int/organization/wfp/rss.xml", forceMali: false },
];

const MALI_KEYWORDS = [
  "mali", "malien", "malienne", "maliens", "maliennes", "bamako",
  "tombouctou", "timbuktu", "gao", "kidal", "mopti", "ségou", "segou",
  "kayes", "koulikoro", "sikasso", "taoudénit", "taoudenit", "ménaka", "menaka",
  "goundam", "douentza", "ansongo", "bourem", "niafunké", "niafunke",
  "niono", "bla", "san", "bandiagara", "djenné", "djenne", "tenenkou",
  "minusma", "fama", "fam", "cnsp mali", "transition mali",
  "azawad", "touareg mali", "mnla", "cma mali",
  "jnim", "gsim", "katiba macina", "ansarul islam mali",
  "crise malienne", "conflit mali", "déplacés mali", "idp mali",
  "famine mali", "insécurité alimentaire mali", "malnutrition mali",
  "inondations mali", "choléra mali",
];

const SUBREGION_KEYWORDS = [
  "burkina faso", "burkinabè", "ouagadougou",
  "niger", "niamey", "nigérien",
  "mauritanie", "mauritanien", "nouakchott",
  "guinée", "conakry",
  "sénégal", "dakar", "sénégalais",
  "côte d'ivoire", "ivoirien", "abidjan",
  "algérie", "libye",
  "sahel", "g5 sahel", "g5sahel", "liptako gourma",
  "lac tchad", "bassin du lac tchad",
  "afrique de l'ouest", "west africa", "afrique subsaharienne",
  "cedeao", "ecowas", "uemoa",
  "alliance des états du sahel", "aes",
  "crise sahélienne", "déplacés sahel", "pastoralisme sahel",
];

const HUMANITARIAN_KEYWORDS = [
  "humanitaire", "humanitarian", "aide humanitaire",
  "réfugié", "réfugiés", "refugee", "refugees",
  "déplacé", "déplacés", "déplacée", "idp", "pdip",
  "protection civile", "civil protection",
  "urgence", "emergency", "crise", "crisis",
  "famine", "faim", "malnutrition", "sous-alimentation",
  "choléra", "épidémie", "pandémie",
  "inondation", "sécheresse", "drought", "flood",
  "wash", "eau potable", "assainissement",
  "abri", "shelter", "nfi",
  "ocha", "unicef", "unhcr", "pam", "wfp", "fao",
  "msf", "croix rouge", "cicr", "icrc",
  "plan international", "oxfam", "save the children",
  "cohésion sociale", "réconciliation", "paix",
];

const REJECT_KEYWORDS = [
  "élection", "elections", "electoral", "vote", "scrutin", "candidat",
  "président", "premier ministre", "gouvernement", "parlement", "assemblée nationale",
  "coup d'état", "putsch", "junte", "transition politique",
  "parti politique", "opposition politique", "coalition gouvernementale",
  "diplomatie", "ambassadeur", "ambassade", "relations bilatérales",
  "sommet politique", "accord politique", "négociation politique",
  "opération militaire", "offensive militaire", "frappe aérienne",
  "bilan militaire", "pertes militaires", "soldats tués", "combattants tués",
  "victoire militaire", "défaite militaire", "front de guerre",
  "armement", "livraison d'armes", "sanctions militaires",
  "pib", "croissance économique", "inflation", "taux de change",
  "bourse", "marché financier", "investissement étranger",
  "accord commercial", "dette extérieure", "fmi accord",
  "banque mondiale projet", "privatisation",
  "football", "can 2024", "coupe du monde", "championnat",
  "concert", "festival culturel", "cinéma", "musique",
  "célébrité", "artiste",
  "accident de la route", "accident de voiture", "incendie criminel",
  "braquage", "vol à main armée", "trafic de drogue",
];

function scoreArticle(titre: string, resume: string): number {
  const text = (titre + " " + (resume || "")).toLowerCase();

  const isRejected = REJECT_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  if (isRejected) {
    console.log(`[RSS] Rejeté (non humanitaire) : ${titre}`);
    return 0;
  }

  if (MALI_KEYWORDS.some(kw => text.includes(kw))) return 3;
  if (SUBREGION_KEYWORDS.some(kw => text.includes(kw))) return 2;
  if (HUMANITARIAN_KEYWORDS.some(kw => text.includes(kw))) return 1;

  console.log(`[RSS] Rejeté (hors scope) : ${titre}`);
  return 0;
}

function extractImage(item: any): string | null {
  const mediaContent = item["media:content"]?.["$"]?.url || item["media:content"]?.url;
  if (mediaContent && /\.(jpg|jpeg|png|webp|gif)/i.test(mediaContent)) return mediaContent;

  const mediaThumbnail = item["media:thumbnail"]?.["$"]?.url || item["media:thumbnail"]?.url;
  if (mediaThumbnail) return mediaThumbnail;

  const desc = item["content:encoded"] || item.content || item.description || "";
  if (desc) {
    const match = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];
  }

  if (item.enclosure?.url && /\.(jpg|jpeg|png|webp|gif)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }

  return null;
}

export async function syncActualites(): Promise<{ added: number; skipped: number }> {
  let added = 0;
  let skipped = 0;

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      let humanitaireGeneralCount = 0;

      for (const item of feed.items.slice(0, 30)) {
        const guid = item.guid || item.link || "";
        if (!guid) continue;

        const scoreBase = scoreArticle(item.title || "", item.contentSnippet || "");
        const score = source.forceMali && scoreBase > 0 ? 3 : scoreBase;

        if (score === 0) continue;

        if (score === 1) {
          if (humanitaireGeneralCount >= 3) continue;
          humanitaireGeneralCount++;
        }

        const existing = await db
          .select()
          .from(actualites)
          .where(eq(actualites.guid, guid))
          .limit(1);

        if (existing.length > 0) { skipped++; continue; }

        await db.insert(actualites).values({
          titre: item.title || "Sans titre",
          resume: item.contentSnippet || null,
          imageUrl: extractImage(item),
          source: source.name,
          sourceUrl: item.link || "",
          publieLe: item.pubDate ? new Date(item.pubDate) : null,
          guid,
        });

        console.log(`[RSS score:${score}] ${item.title}`);
        added++;
      }
    } catch (err) {
      console.error(`Erreur RSS ${source.url}:`, err);
    }
  }

  return { added, skipped };
}
