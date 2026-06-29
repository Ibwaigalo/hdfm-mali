import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { actualites } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import EmissionCard from "@/components/emissions/EmissionCard";
import ActualiteCard from "@/components/actualites/ActualiteCard";
import DerniersJournaux from "@/components/home/DerniersJournaux";

import FadeInUp from "@/components/animations/FadeInUp";
import StaggerContainer from "@/components/animations/StaggerContainer";
import StaggerItem from "@/components/animations/StaggerItem";
import { getCategory } from "@/lib/categories";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight, Radio, Globe, Mic, Eye, Flag, Calendar, Youtube, Mail, Heart } from "lucide-react";
import RadiosMarquee from "@/components/radios/RadiosMarquee";
export const dynamic = 'force-dynamic';

async function getData() {
  function getMaliScore(titre: string): number {
    const t = titre.toLowerCase();
    if (["mali", "malien", "bamako", "gao", "mopti", "kidal"].some(kw => t.includes(kw))) return 3;
    if (["burkina", "niger", "sahel", "mauritanie"].some(kw => t.includes(kw))) return 2;
    return 1;
  }

  const [emissionsResult, actusRaw, articlesResult] = await Promise.all([
    db.execute(sql`SELECT id, yt_video_id as "ytVideoId", titre, description, thumbnail_url as "thumbnailUrl", duree, published_at as "publishedAt", synced_at as "syncedAt", visible, categorie FROM emissions WHERE visible = true ORDER BY published_at DESC LIMIT 200`),
    db.select().from(actualites).orderBy(desc(actualites.publieLe)).limit(20),
    db.execute(sql`SELECT a.id, a.titre, a.slug, a.image_url as "imageUrl", a.created_at as "createdAt", a.categorie, u.nom as auteur_nom FROM articles a LEFT JOIN users u ON u.id = a.auteur_id WHERE a.statut = 'publie' ORDER BY a.created_at DESC LIMIT 3`),
  ]);
  const allEmissions = emissionsResult.rows as any[];
  const articlesRaw = articlesResult.rows as any[];

  const dernieresActus = actusRaw
    .sort((a, b) => {
      const diff = getMaliScore(b.titre) - getMaliScore(a.titre);
      if (diff !== 0) return diff;
      return new Date(b.publieLe || b.fetchedAt).getTime() - new Date(a.publieLe || a.fetchedAt).getTime();
    })
    .slice(0, 3);

  // Dernier journal par langue
  const grouped: Record<string, any[]> = { Français: [], Arabe: [], Bambara: [] };
  for (const e of allEmissions) {
    const titre = e.titre.toLowerCase();
    if (titre.includes("journal") || titre.includes("jr") || titre.includes("info")) {
      if (titre.includes("arabe") || titre.includes("arabic")) grouped.Arabe.push(e);
      else if (titre.includes("bambara") || titre.includes("bamb")) grouped.Bambara.push(e);
      else grouped.Français.push(e);
    }
  }

  // Panorama : dernière émission par catégorie (hors journaux)
  const byCat: Record<string, (typeof allEmissions)[0]> = {};
  for (const e of allEmissions) {
    if (!e.categorie || e.categorie === "journaux") continue;
    if (!byCat[e.categorie]) byCat[e.categorie] = e;
  }
  const panorama = Object.entries(byCat).map(([catId, emission]) => ({
    catId,
    emission,
  })).sort((a, b) => (getCategory(a.catId)?.label || a.catId).localeCompare(getCategory(b.catId)?.label || b.catId));

  // Stats
  const journalsCount = grouped.Français.length + grouped.Arabe.length + grouped.Bambara.length;
  const totalEmissions = allEmissions.length;

  return {
    panorama,
    dernieresActus,
    derniersJournaux: {
      francais: grouped.Français[0] ?? null,
      arabe: grouped.Arabe[0] ?? null,
      bambara: grouped.Bambara[0] ?? null,
    },
    articlesRecents: articlesRaw,
    stats: {
      emissions: totalEmissions,
      journaux: journalsCount,
      actualites: actusRaw.length,
      articles: articlesRaw.length,
    },
  };
}

export default async function HomePage() {
  const { panorama, dernieresActus, derniersJournaux, articlesRecents, stats } = await getData();

  return (
    <>
      <section style={{ background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/hero.png') bottom center/cover no-repeat", color: "white", padding: "5rem 1.5rem", position: "relative", overflow: "hidden", minHeight: 480, display: "flex", alignItems: "center" }}>
        <FadeInUp delay={0.15} distance={40} style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(58,170,53,0.2)", border: "1px solid rgba(58,170,53,0.4)", borderRadius: 100, padding: "0.375rem 1rem", fontSize: "0.8rem", fontWeight: 600, color: "#86efac", marginBottom: "1.5rem", letterSpacing: "0.04em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2s infinite" }} />
            EN DIRECT · 96.00 FM
          </div>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15, marginBottom: "1.25rem", color: "white" }}>
            Radio Humanité et Développement
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 680, margin: "0 auto 2.5rem", fontStyle: "italic" }}>
            « La voix des communautés au cœur de l'action humanitaire,<br />la voix des humanitaires au service des communautés »
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <a href="#player" style={{ background: "var(--green)", color: "white", padding: "0.875rem 2rem", borderRadius: 8, fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Écouter en direct
            </a>
            <Link href="/emissions" style={{ background: "rgba(255,255,255,0.12)", color: "white", padding: "0.875rem 2rem", borderRadius: 8, fontWeight: 600, fontSize: "1rem", border: "1px solid rgba(255,255,255,0.25)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Voir les émissions
            </Link>
          </div>
        </FadeInUp>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </section>

      {/* Radios partenaires – carrousel */}
      <section style={{ background: "var(--bg-white)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ paddingTop: "1.75rem" }}>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--text)", marginBottom: "0.2rem" }}>
              Radios partenaires
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              13 radios locales relaient nos programmes à travers le Mali
            </p>
          </div>
          <RadiosMarquee />
        </div>
      </section>

      {/* Chiffres clés */}
      <section style={{ background: "linear-gradient(135deg, #1A5FA8 0%, #14437a 100%)", color: "white", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
            {[
              { icon: <Mic size={20} />, label: "Émissions", value: stats.emissions },
              { icon: <Globe size={20} />, label: "Journaux", value: stats.journaux },
              { icon: <Radio size={20} />, label: "Actualités", value: stats.actualites },
              { icon: <Eye size={20} />, label: "Articles", value: stats.articles },
              { icon: <Radio size={20} />, label: "Radios partenaires", value: 13 },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div style={{ padding: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.4rem", opacity: 0.8 }}>
                    {item.icon}
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", lineHeight: 1.1 }}>
                    {item.value}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <FadeInUp><DerniersJournaux francais={derniersJournaux.francais} arabe={derniersJournaux.arabe} bambara={derniersJournaux.bambara} /></FadeInUp>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <FadeInUp>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>Nos émissions</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Une émission par thématique — retrouvez tous les replays</p>
            </div>
            <Link href="/emissions" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--blue)" }}>
              Toutes les émissions <ChevronRight size={16} />
            </Link>
          </div>
        </FadeInUp>
        {panorama.length === 0 ? (
          <FadeInUp><div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-white)", borderRadius: 10, border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            Les émissions seront disponibles après la première synchronisation YouTube.
          </div></FadeInUp>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {panorama.map(({ catId, emission }) => {
              const cat = getCategory(catId);
              return (
                <div key={catId}>
                  <Link href={`/emissions?cat=${catId}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", textDecoration: "none" }}>
                    <div style={{ width: 3, height: 16, borderRadius: 2, background: cat?.color || "var(--blue)" }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: cat?.color || "var(--text)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {cat?.label || catId}
                    </span>
                    <ChevronRight size={14} color={cat?.color || "var(--text-muted)"} />
                  </Link>
                  <EmissionCard ytVideoId={emission.ytVideoId} titre={emission.titre} thumbnailUrl={emission.thumbnailUrl || ""} duree={emission.duree || ""} publishedAt={emission.publishedAt} categorie={cat?.label} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ background: "var(--bg-white)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeInUp>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>Actualités humanitaires</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Informations en temps réel — UNICEF, OCHA, ReliefWeb, UNHCR</p>
              </div>
              <Link href="/actualites" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--blue)" }}>
                Toutes les actualités <ChevronRight size={16} />
              </Link>
            </div>
          </FadeInUp>
          <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {dernieresActus.map((a) => (
              <StaggerItem key={a.id}><ActualiteCard key={a.id} titre={a.titre} resume={a.resume} imageUrl={a.imageUrl} source={a.source} sourceUrl={a.sourceUrl} publieLe={a.publieLe} /></StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Articles récents */}
      {articlesRecents.length > 0 && (
        <section style={{ background: "var(--bg-white)", padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeInUp>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                  <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>Articles récents</h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Analyses, reportages et informations de la rédaction</p>
                </div>
                <Link href="/blog" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--blue)" }}>
                  Tous les articles <ChevronRight size={16} />
                </Link>
              </div>
            </FadeInUp>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {articlesRecents.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} style={{ display: "block", background: "var(--bg-white)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", textDecoration: "none", transition: "box-shadow 0.2s, transform 0.2s" }} className="article-card-home">
                  <div style={{ position: "relative", aspectRatio: "16/9", background: "#e5e7eb" }}>
                    {a.imageUrl ? (
                      <Image src={a.imageUrl} alt={a.titre} fill style={{ objectFit: "cover" }} sizes="400px" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--blue) 0%, #14437a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontWeight: 800, fontSize: "1.25rem" }}>HD FM</span>
                      </div>
                    )}
                    {a.categorie && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: "var(--green)", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "2px 10px", borderRadius: 4 }}>{a.categorie}</div>
                    )}
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.4, marginBottom: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.titre}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={12} /> {format(new Date(a.createdAt), "d MMM yyyy", { locale: fr })}
                      </span>
                      {a.auteur_nom && <span>Par {a.auteur_nom}</span>}
                    </div>
                  </div>
                  <style>{`.article-card-home:hover { box-shadow: 0 4px 20px rgba(26,95,168,0.12); transform: translateY(-2px); }`}</style>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeInUp>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)" }}>Notre engagement</h2>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: "0.75rem", maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                « La voix des communautés au cœur de l'action humanitaire, la voix des humanitaires au service des communautés »
              </p>
              <div style={{ width: 50, height: 3, background: "var(--green)", borderRadius: 2, margin: "1rem auto 0" }} />
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.15} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.75rem", marginBottom: "4rem" }}>
            {[
              { titre: "Notre vision", color: "var(--blue)", bg: "rgba(26,95,168,0.06)", icon: <Eye size={22} />, texte: "La vision de la Radio HD FM est celle d'un espace médiatique libre, inclusif et accessible, au service des populations vulnérables, contribuant à une société mieux informée, plus résiliente et une réponse humanitaire plus coordonnée et participative face aux crises." },
              { titre: "Notre mission", color: "var(--green)", bg: "rgba(58,170,53,0.06)", icon: <Flag size={22} />, texte: "La mission de la Radio HD FM est de diffuser une information humanitaire, éducative et communautaire de qualité, dans le respect des principes d'humanité, d'impartialité, de neutralité et d'indépendance." },
            ].map((card) => (
              <StaggerItem key={card.titre}>
                <div style={{ background: "var(--bg-white)", borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", transition: "box-shadow 0.25s, transform 0.25s" }} className="engagement-card">
                  <div style={{ height: 4, background: card.color }} />
                  <div style={{ padding: "2rem 1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                        {card.icon}
                      </div>
                      <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>{card.titre}</h3>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{card.texte}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div style={{ marginBottom: "2.5rem" }}>
            <FadeInUp>
              <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.5rem", textAlign: "center" }}>Nos objectifs spécifiques</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", textAlign: "center", marginBottom: "2rem", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                Sept engagements concrets pour une radio au service des communautés
              </p>
            </FadeInUp>
            <StaggerContainer staggerDelay={0.06} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {[
                "Renforcer la coordination humanitaire et les actions de développement par la diffusion d'informations et produits humanitaires",
                "Soutenir les dynamiques communautaires à travers des programmes interactifs et participatifs favorisant le dialogue entre acteurs et populations locales",
                "Donner la parole aux communautés et humanitaires pour faciliter l'accès aux services disponibles et la prise en compte des feedbacks et besoins",
                "Couvrir et informer le grand public sur les événements humanitaires et de développement réalisés",
                "Initier et mettre en oeuvre des projets et programmes de renforcement des capacités des acteurs de médias et acteurs humanitaires sur la communication humanitaire",
                "Renforcer à travers une communication de proximité, la cohésion sociale, la prévention des conflits, le retour des PDIs et réfugiés et la réintégration des rapatriés",
                "Diffuser des messages de sensibilisation sur les risques liés aux conflits, aux épidémies, aux catastrophes naturelles ou à la désinformation",
              ].map((obj, i) => (
                <StaggerItem key={i}>
                  <div style={{ display: "flex", gap: "1rem", padding: "1.1rem 1.25rem", border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-white)", transition: "box-shadow 0.2s, transform 0.2s" }} className="objectif-card">
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: i < 3 ? "rgba(26,95,168,0.08)" : "rgba(58,170,53,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: i < 3 ? "var(--blue)" : "var(--green)" }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{obj}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Soutenir HD FM */}
          <FadeInUp>
            <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: 14, padding: "2.5rem 2rem", marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
                <div style={{ flex: "1 1 280px" }}>
                  <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                    Soutenir Radio HD FM
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                    Vous souhaitez contribuer à notre mission d'information humanitaire ?
                    Contactez-nous, abonnez-vous à notre chaîne YouTube ou devenez partenaire.
                  </p>
                </div>
                <div style={{ flex: "1 1 280px", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  <a href="https://www.youtube.com/@RadioHumanitéetDéveloppement" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#c4302b", color: "white", padding: "0.7rem 1.25rem", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", transition: "opacity 0.15s" }} className="btn-yl">
                    <Youtube size={18} /> YouTube
                  </a>
                  <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--blue)", color: "white", padding: "0.7rem 1.25rem", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", transition: "opacity 0.15s" }} className="btn-yl">
                    <Mail size={18} /> Nous écrire
                  </Link>
                  <Link href="/programme" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--green)", color: "white", padding: "0.7rem 1.25rem", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", transition: "opacity 0.15s" }} className="btn-yl">
                    <Calendar size={18} /> Programme
                  </Link>
                  <style>{`.btn-yl:hover { opacity: 0.9; }`}</style>
                </div>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
              <Link href="/programme" style={{ background: "var(--blue)", color: "white", padding: "0.875rem 2rem", borderRadius: 8, fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", transition: "transform 0.15s" }} className="btn-link">
                Programme des émissions <ChevronRight size={18} />
              </Link>
              <Link href="/contact" style={{ background: "var(--green)", color: "white", padding: "0.875rem 2rem", borderRadius: 8, fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", transition: "transform 0.15s" }} className="btn-link">
                Nous contacter <ChevronRight size={18} />
              </Link>
            </div>
          </FadeInUp>
        </div>
        <style>{`
          .engagement-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); transform: translateY(-3px); }
          .objectif-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateX(3px); }
          .btn-link:hover { transform: scale(1.04); }
        `}</style>
      </section>
    </>
  );
}
