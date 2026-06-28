# Radio HD FM — Site officiel Next.js 14

Site officiel de **Radio Humanité et Développement HD FM** (96.00 FM, Bamako, Mali).

## Stack technique
- **Framework** : Next.js 14 (App Router)
- **Base de données** : Neon PostgreSQL + Drizzle ORM
- **Auth** : NextAuth v5
- **Styling** : Tailwind CSS + CSS Variables
- **Déploiement** : Vercel

## Fonctionnalités
- Player live Zeno.fm persistant (barre fixe en bas)
- Émissions YouTube synchronisées automatiquement (cron toutes les heures)
- Actualités humanitaires RSS (UNICEF, ReliefWeb, OCHA, UNHCR) — toutes les 30 min
- Programme hebdomadaire
- Journaux FR / Arabe / Bambara
- Articles / Blog (CRUD admin)
- Espace auditeurs + formulaire contact
- Back-office admin complet

## Installation

```bash
npm install
```

## Configuration

Copier `.env.local` et renseigner :
- `DATABASE_URL` — URL Neon PostgreSQL
- `NEXTAUTH_SECRET` — clé secrète aléatoire
- `NEXTAUTH_URL` — URL de déploiement
- `YOUTUBE_API_KEY` — clé YouTube Data API v3
- `NEXT_PUBLIC_ZENO_STREAM_URL` — URL flux Zeno.fm
- `CRON_SECRET` — secret pour protéger les crons

## Base de données

```bash
npm run db:generate   # générer les migrations
npm run db:migrate    # appliquer les migrations
npm run seed:admin    # créer le compte admin initial
```

## Développement

```bash
npm run dev
```

## Déploiement Vercel

1. Push sur GitHub (`Ibwaigalo/hdfm-next`)
2. Connecter le repo sur Vercel
3. Ajouter les variables d'environnement
4. Les crons Vercel s'activent automatiquement (voir `vercel.json`)

## Crons automatiques

| Endpoint | Fréquence | Rôle |
|---|---|---|
| `/api/cron/youtube` | Toutes les heures | Sync émissions YouTube |
| `/api/cron/rss` | Toutes les 30 min | Sync actualités humanitaires |

## Admin

URL : `/admin/login`  
Créer le premier compte : `npm run seed:admin`
