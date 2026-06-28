import { db } from "@/db";
import { emissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { detectCategory } from "@/lib/categories";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNEL_HANDLE = (process.env.YOUTUBE_CHANNEL_HANDLE || "@RadioHumanitéetDéveloppement").trim();

interface YTVideo {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duree: string;
}

export async function getChannelId(): Promise<string | null> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(CHANNEL_HANDLE)}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items?.[0]?.id ?? null;
}

export async function fetchRecentVideos(channelId: string, maxResults = 50): Promise<YTVideo[]> {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  if (!searchData.items || searchData.items.length === 0) return [];
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();
  return (detailsData.items || []).map((item: any) => ({
    id: item.id,
    titre: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      "",
    publishedAt: item.snippet.publishedAt,
    duree: item.contentDetails?.duration || "",
  }));
}

export async function fetchAllVideos(channelId: string, maxVideos = 500): Promise<YTVideo[]> {
  let allItems: any[] = [];
  let pageToken = "";
  do {
    const remaining = maxVideos - allItems.length;
    const batchSize = Math.min(50, remaining);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${batchSize}&key=${YOUTUBE_API_KEY}${pageToken ? "&pageToken=" + pageToken : ""}`;
    const res = await (await fetch(searchUrl)).json();
    if (!res.items) break;
    allItems.push(...res.items);
    pageToken = res.nextPageToken || "";
  } while (pageToken && allItems.length < maxVideos);

  const videos: YTVideo[] = [];
  for (let i = 0; i < allItems.length; i += 50) {
    const batch = allItems.slice(i, i + 50);
    const videoIds = batch.map((item: any) => item.id.videoId).join(",");
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const detailsRes = await (await fetch(detailsUrl)).json();
    for (const item of detailsRes.items || []) {
      videos.push({
        id: item.id,
        titre: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails?.maxres?.url ||
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          "",
        publishedAt: item.snippet.publishedAt,
        duree: item.contentDetails?.duration || "",
      });
    }
  }
  return videos;
}

export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = match[1] ? `${match[1]}h ` : "";
  const m = match[2] ? `${match[2]}m ` : "";
  const s = match[3] && !match[1] ? `${match[3]}s` : "";
  return `${h}${m}${s}`.trim();
}

export async function syncYouTubeEmissions(): Promise<{ added: number; skipped: number }> {
  const channelId = await getChannelId();
  if (!channelId) throw new Error("Chaîne YouTube introuvable");
  const videos = await fetchRecentVideos(channelId, 50);
  let added = 0;
  let skipped = 0;
  for (const video of videos) {
    const existing = await db.select().from(emissions).where(eq(emissions.ytVideoId, video.id)).limit(1);
    if (existing.length > 0) { skipped++; continue; }
    await db.insert(emissions).values({
      ytVideoId: video.id,
      titre: video.titre,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      duree: formatDuration(video.duree),
      publishedAt: new Date(video.publishedAt),
      categorie: detectCategory(video.titre),
    });
    added++;
  }
  return { added, skipped };
}

export async function syncAllYouTubeEmissions(maxVideos = 500): Promise<{ added: number; skipped: number }> {
  const channelId = await getChannelId();
  if (!channelId) throw new Error("Chaîne YouTube introuvable");
  const videos = await fetchAllVideos(channelId, maxVideos);
  let added = 0;
  let skipped = 0;
  for (const video of videos) {
    const existing = await db.select().from(emissions).where(eq(emissions.ytVideoId, video.id)).limit(1);
    if (existing.length > 0) { skipped++; continue; }
    await db.insert(emissions).values({
      ytVideoId: video.id,
      titre: video.titre,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      duree: formatDuration(video.duree),
      publishedAt: new Date(video.publishedAt),
      categorie: detectCategory(video.titre),
    });
    added++;
  }
  return { added, skipped };
}
