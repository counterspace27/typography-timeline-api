# Typography Timeline — Deployment Guide

Two repos, two Vercel projects, one DreamHost page.

```
timeline-api/    → Vercel (Node.js API + Turso database)
timeline-admin/  → Vercel (React admin UI, static)
timeline.html    → DreamHost (your existing shared hosting)
```

---

## Step 1 — Set up Turso (free database)

Turso is a serverless SQLite service — same database as local, hosted in the cloud.

1. Go to **turso.tech** and sign up (free)
2. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. Log in and create your database:
   ```bash
   turso auth login
   turso db create typography-timeline
   turso db show typography-timeline        # copy the URL
   turso db tokens create typography-timeline  # copy the token
   ```
4. Save these — you'll need them in Step 3:
   - `TURSO_DATABASE_URL` (looks like `libsql://typography-timeline-xxx.turso.io`)
   - `TURSO_AUTH_TOKEN` (long JWT string)

---

## Step 2 — Prepare the API for Turso

Update `prisma/schema.prisma` to use the Turso adapter:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"   // still used for local dev
}
```

Install the Turso Prisma adapter:
```bash
cd timeline-api
npm install @prisma/adapter-libsql @libsql/client
```

Update `src/server.js` top section to use Turso in production:
```js
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

let prisma
if (process.env.TURSO_DATABASE_URL) {
  // Production: Turso
  const libsql = createClient({
    url:       process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  const adapter = new PrismaLibSQL(libsql)
  prisma = new PrismaClient({ adapter })
} else {
  // Local: SQLite file
  prisma = new PrismaClient()
}
```

Run migrations against Turso to create the tables:
```bash
TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx prisma db push
```

Then seed production data:
```bash
TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node prisma/seed.js
```

---

## Step 3 — Deploy the API to Vercel

### Option A: Deploy via Vercel dashboard (easiest)

1. Push `timeline-api/` to a GitHub repo
2. Go to **vercel.com** → New Project → Import that repo
3. Framework Preset: **Other** (not Next.js)
4. Add Environment Variables:
   ```
   TURSO_DATABASE_URL   = libsql://your-db.turso.io
   TURSO_AUTH_TOKEN     = your-token-here
   ALLOWED_ORIGIN       = https://your-admin.vercel.app
   ```
5. Click Deploy
6. Note your API URL: `https://timeline-api-xxx.vercel.app`

### Option B: Deploy via CLI

```bash
cd timeline-api
npx vercel login
npx vercel --prod
# When prompted, set the env vars above
```

---

## Step 4 — Deploy the Admin to Vercel

1. Push `timeline-admin/` to a GitHub repo
2. Go to **vercel.com** → New Project → Import that repo
3. Framework Preset: **Vite**
4. Add Environment Variable:
   ```
   VITE_API_URL = https://timeline-api-xxx.vercel.app
   ```
   (Use the URL from Step 3)
5. Click Deploy

Or via CLI:
```bash
cd timeline-admin
npx vercel --prod
```

---

## Step 5 — Update the Timeline HTML for DreamHost

At the bottom of `typography-timeline.html`, the data arrays are currently
hardcoded. You have two options:

### Option A: Load data live from the API (recommended)

Replace the hardcoded arrays in the `<script>` section with a fetch call:

```js
async function loadData() {
  const BASE = 'https://timeline-api-xxx.vercel.app'
  const [typo, hist, art] = await Promise.all([
    fetch(`${BASE}/api/typography`).then(r => r.json()),
    fetch(`${BASE}/api/historical`).then(r => r.json()),
    fetch(`${BASE}/api/movements`).then(r => r.json()),
  ])
  typoEvents   = typo.data.map(e => ({ year: e.year, dateLabel: e.dateLabel, name: e.name, desc: e.description, img: e.imageUrl, pos: e.position }))
  histEvents   = hist.data.map(e => ({ year: e.year, dateLabel: e.dateLabel, name: e.name }))
  artMovements = art.data.map(m => ({ start: m.startYear, end: m.endYear, datesLabel: m.datesLabel, name: m.name, desc: m.description }))
  buildTimeline()
}

// Replace buildTimeline() + animateScroll() at the bottom with:
loadData().then(() => tick())
```

Then upload the updated HTML to DreamHost via FTP.

### Option B: Export JSON and paste (no live API dependency)

1. Open the admin, click **Export JSON**
2. Open `timeline-data.json`
3. In `typography-timeline.html`, replace the `let typoEvents = [...]`, `let histEvents = [...]`, and `let artMovements = [...]` arrays with the exported data
4. Upload to DreamHost via FTP

---

## Local development

Run both together:

```bash
# Terminal 1
cd timeline-api && npm run dev      # API on :3001

# Terminal 2  
cd timeline-admin && npm run dev    # Admin on :5173
```

---

## Summary of URLs

| Service | URL |
|---------|-----|
| API | `https://timeline-api-xxx.vercel.app` |
| Admin | `https://timeline-admin-xxx.vercel.app` |
| Timeline | `https://yourdomain.com/typography-timeline.html` |
| Turso Studio | `turso db shell typography-timeline` |
| Vercel Dashboard | `vercel.com/dashboard` |
