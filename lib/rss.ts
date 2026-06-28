import Parser from "rss-parser";
import { db } from "@/db";
import { actualites } from "@/db/schema";
import { eq } from "drizzle-orm";
import https from "https";
import http from "http";
import zlib from "zlib";

const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "enclosure", "content:encoded"],
  },
});

function fetchXml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fetcher = url.startsWith("https") ? https : http;
    fetcher.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      const chunks: Buffer[] = [];
      const encoding = res.headers["content-encoding"];
      if (encoding === "gzip") {
        const gunzip = zlib.createGunzip();
        gunzip.on("data", (chunk: Buffer) => chunks.push(chunk));
        gunzip.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        gunzip.on("error", reject);
        res.pipe(gunzip);
      } else {
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", reject);
      }
    }).on("error", reject);
  });
}

interface RssSource {
  name: "ReliefWeb" | "OCHA" | "UNICEF" | "UNHCR";
  url: string;
}

const RSS_SOURCES: RssSource[] = [
  { name: "ReliefWeb", url: "https://reliefweb.int/updates/rss.xml?legacy-river=country/mli" },
];

const SECONDARY_SOURCES: RssSource[] = [
  { name: "ReliefWeb", url: "https://reliefweb.int/updates/rss.xml" },
];

const BACKUP_SOURCES: RssSource[] = [
  { name: "ReliefWeb", url: "https://reliefweb.int/updates/rss.xml" },
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

function scoreArticle(titre: string, resume: string): number {
  const text = (titre + " " + (resume || "")).toLowerCase();
  if (MALI_KEYWORDS.some(kw => text.includes(kw))) return 3;
  if (SUBREGION_KEYWORDS.some(kw => text.includes(kw))) return 2;
  if (HUMANITARIAN_KEYWORDS.some(kw => text.includes(kw))) return 1;
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

async function fetchSource(source: RssSource, isBackup = false): Promise<number> {
  const xml = await fetchXml(source.url);
  const feed = await parser.parseString(xml);
  let added = 0;
  let humanitaireGeneralCount = 0;
  const MAX_HUMANITAIRE_GENERAL = 5;

  for (const item of feed.items.slice(0, 30)) {
    const guid = item.guid || item.link || "";
    if (!guid) continue;

    if (isBackup) {
      const score = scoreArticle(item.title || "", item.contentSnippet || "");

      if (score === 0) {
        console.log(`[RSS] Rejeté : ${item.title}`);
        continue;
      }

      if (score === 1) {
        if (humanitaireGeneralCount >= MAX_HUMANITAIRE_GENERAL) continue;
        humanitaireGeneralCount++;
      }
    }

    const existing = await db.select().from(actualites).where(eq(actualites.guid, guid)).limit(1);
    if (existing.length > 0) continue;

    const imageUrl = extractImage(item);

    await db.insert(actualites).values({
      titre: item.title || "Sans titre",
      resume: item.contentSnippet || item.summary || null,
      imageUrl,
      source: source.name,
      sourceUrl: item.link || "",
      publieLe: item.pubDate ? new Date(item.pubDate) : null,
      guid,
    });

    console.log(`[RSS] Ajouté : ${item.title}`);
    added++;
  }

  return added;
}

export async function syncActualites(): Promise<{ added: number; skipped: number }> {
  let added = 0;
  let skipped = 0;

  for (const source of RSS_SOURCES) {
    try {
      added += await fetchSource(source);
    } catch (err) {
      console.error(`Erreur RSS ${source.name} (${source.url}):`, (err as Error).message?.slice(0, 60));
    }
  }

  for (const source of SECONDARY_SOURCES) {
    try {
      added += await fetchSource(source, true);
    } catch (err) {
      console.error(`Erreur RSS secondary ${source.name}:`, (err as Error).message?.slice(0, 60));
    }
  }

  if (added === 0) {
    console.log("[RSS] Aucune source — tentative des sources de secours...");
    for (const source of BACKUP_SOURCES) {
      try {
        added += await fetchSource(source, true);
      } catch (err) {
        console.error(`Erreur RSS backup ${source.name}:`, (err as Error).message?.slice(0, 60));
      }
    }
  }

  return { added, skipped };
}
