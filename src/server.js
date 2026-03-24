import express from 'express'
import cors from 'cors'
import { createClient } from '@libsql/client'

const app = express()
const PORT = process.env.PORT || 3001

// ── Database ─────────────────────────────────────────────────────────
const db = createClient({
  url:       process.env.TURSO_DATABASE_URL || 'file:./timeline.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function initDb() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS TypographyEvent (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      year        INTEGER NOT NULL,
      dateLabel   TEXT NOT NULL DEFAULT '',
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      imageUrl    TEXT NOT NULL DEFAULT '',
      position    TEXT NOT NULL DEFAULT 'top',
      createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS HistoricalEvent (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      year      INTEGER NOT NULL,
      dateLabel TEXT NOT NULL DEFAULT '',
      name      TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ArtMovement (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      startYear   INTEGER NOT NULL,
      endYear     INTEGER NOT NULL,
      datesLabel  TEXT NOT NULL DEFAULT '',
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

initDb().catch(e => console.error('DB init error:', e.message))

// ── CORS ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/,
  /\.dreamhost\.com$/,
  /\.counterspace\.us$/,
  'https://counterspace.us',
  'https://timeline.counterspace.us',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const ok = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    )
    cb(ok ? null : new Error('Not allowed by CORS'), ok)
  },
  credentials: true,
}))
app.use(express.json())

// ── Helpers ───────────────────────────────────────────────────────────
function fmtY(y) { return y <= 0 ? `${Math.abs(y)} BCE` : `${y} CE` }

function rowToObj(row) {
  // libsql returns rows as objects already
  return row
}

function applySearch(rows, q) {
  if (!q) return rows
  const term = q.toLowerCase()
  return rows.filter(r => {
    const fields = [r.name, r.dateLabel, r.datesLabel, r.description,
      String(r.year ?? ''), String(r.startYear ?? ''), String(r.endYear ?? '')]
    return fields.filter(Boolean).some(f => f.toLowerCase().includes(term))
  })
}

function sortRows(rows, sort, order) {
  return [...rows].sort((a, b) => {
    const av = a[sort] ?? 0
    const bv = b[sort] ?? 0
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
    return order === 'desc' ? -cmp : cmp
  })
}

// ── TYPOGRAPHY EVENTS ─────────────────────────────────────────────────

app.get('/api/typography', async (req, res) => {
  try {
    const { q, sort = 'year', order = 'asc' } = req.query
    const result = await db.execute('SELECT * FROM TypographyEvent')
    let rows = result.rows
    if (q) rows = applySearch(rows, q)
    rows = sortRows(rows, sort, order)
    res.json({ data: rows, total: rows.length })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/typography/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM TypographyEvent WHERE id = ?', args: [req.params.id] })
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/typography', async (req, res) => {
  try {
    const { year, dateLabel, name, description, imageUrl, position } = req.body
    if (!year || !name) return res.status(400).json({ error: 'year and name required' })
    const result = await db.execute({
      sql: `INSERT INTO TypographyEvent (year, dateLabel, name, description, imageUrl, position)
            VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [Number(year), dateLabel || fmtY(Number(year)), name, description || '', imageUrl || '', position || 'top']
    })
    res.status(201).json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.patch('/api/typography/:id', async (req, res) => {
  try {
    const allowed = ['year', 'dateLabel', 'name', 'description', 'imageUrl', 'position']
    const fields = Object.keys(req.body).filter(k => allowed.includes(k))
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' })
    const sets = fields.map(f => `${f} = ?`).join(', ')
    const args = [...fields.map(f => f === 'year' ? Number(req.body[f]) : req.body[f]), req.params.id]
    const result = await db.execute({
      sql: `UPDATE TypographyEvent SET ${sets}, updatedAt = datetime('now') WHERE id = ? RETURNING *`,
      args
    })
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/typography/:id', async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM TypographyEvent WHERE id = ?', args: [req.params.id] })
    res.json({ deleted: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── HISTORICAL EVENTS ─────────────────────────────────────────────────

app.get('/api/historical', async (req, res) => {
  try {
    const { q, sort = 'year', order = 'asc' } = req.query
    const result = await db.execute('SELECT * FROM HistoricalEvent')
    let rows = result.rows
    if (q) rows = applySearch(rows, q)
    rows = sortRows(rows, sort, order)
    res.json({ data: rows, total: rows.length })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/historical/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM HistoricalEvent WHERE id = ?', args: [req.params.id] })
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/historical', async (req, res) => {
  try {
    const { year, dateLabel, name } = req.body
    if (!year || !name) return res.status(400).json({ error: 'year and name required' })
    const result = await db.execute({
      sql: 'INSERT INTO HistoricalEvent (year, dateLabel, name) VALUES (?, ?, ?) RETURNING *',
      args: [Number(year), dateLabel || fmtY(Number(year)), name]
    })
    res.status(201).json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.patch('/api/historical/:id', async (req, res) => {
  try {
    const allowed = ['year', 'dateLabel', 'name']
    const fields = Object.keys(req.body).filter(k => allowed.includes(k))
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' })
    const sets = fields.map(f => `${f} = ?`).join(', ')
    const args = [...fields.map(f => f === 'year' ? Number(req.body[f]) : req.body[f]), req.params.id]
    const result = await db.execute({
      sql: `UPDATE HistoricalEvent SET ${sets}, updatedAt = datetime('now') WHERE id = ? RETURNING *`,
      args
    })
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/historical/:id', async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM HistoricalEvent WHERE id = ?', args: [req.params.id] })
    res.json({ deleted: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── ART MOVEMENTS ─────────────────────────────────────────────────────

app.get('/api/movements', async (req, res) => {
  try {
    const { q, sort = 'startYear', order = 'asc' } = req.query
    const result = await db.execute('SELECT * FROM ArtMovement')
    let rows = result.rows
    if (q) rows = applySearch(rows, q)
    rows = sortRows(rows, sort, order)
    res.json({ data: rows, total: rows.length })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/movements/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM ArtMovement WHERE id = ?', args: [req.params.id] })
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/movements', async (req, res) => {
  try {
    const { startYear, endYear, datesLabel, name, description } = req.body
    if (!startYear || !endYear || !name) return res.status(400).json({ error: 'startYear, endYear, name required' })
    const result = await db.execute({
      sql: `INSERT INTO ArtMovement (startYear, endYear, datesLabel, name, description)
            VALUES (?, ?, ?, ?, ?) RETURNING *`,
      args: [Number(startYear), Number(endYear), datesLabel || `${fmtY(Number(startYear))}–${fmtY(Number(endYear))}`, name, description || '']
    })
    res.status(201).json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.patch('/api/movements/:id', async (req, res) => {
  try {
    const allowed = ['startYear', 'endYear', 'datesLabel', 'name', 'description']
    const fields = Object.keys(req.body).filter(k => allowed.includes(k))
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' })
    const numFields = ['startYear', 'endYear']
    const sets = fields.map(f => `${f} = ?`).join(', ')
    const args = [...fields.map(f => numFields.includes(f) ? Number(req.body[f]) : req.body[f]), req.params.id]
    const result = await db.execute({
      sql: `UPDATE ArtMovement SET ${sets}, updatedAt = datetime('now') WHERE id = ? RETURNING *`,
      args
    })
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/movements/:id', async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM ArtMovement WHERE id = ?', args: [req.params.id] })
    res.json({ deleted: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── GLOBAL SEARCH ─────────────────────────────────────────────────────

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ typography: [], historical: [], movements: [] })
    const [t, h, a] = await Promise.all([
      db.execute('SELECT * FROM TypographyEvent'),
      db.execute('SELECT * FROM HistoricalEvent'),
      db.execute('SELECT * FROM ArtMovement'),
    ])
    res.json({
      typography: applySearch(t.rows, q),
      historical:  applySearch(h.rows, q),
      movements:   applySearch(a.rows, q),
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── EXPORT ────────────────────────────────────────────────────────────

app.get('/api/export', async (req, res) => {
  try {
    const [t, h, a] = await Promise.all([
      db.execute('SELECT * FROM TypographyEvent ORDER BY year ASC'),
      db.execute('SELECT * FROM HistoricalEvent ORDER BY year ASC'),
      db.execute('SELECT * FROM ArtMovement ORDER BY startYear ASC'),
    ])
    const payload = {
      exportedAt: new Date().toISOString(),
      typoEvents:   t.rows.map(e => ({ year: e.year, dateLabel: e.dateLabel, name: e.name, desc: e.description, img: e.imageUrl, pos: e.position })),
      histEvents:   h.rows.map(e => ({ year: e.year, dateLabel: e.dateLabel, name: e.name })),
      artMovements: a.rows.map(m => ({ start: m.startYear, end: m.endYear, datesLabel: m.datesLabel, name: m.name, desc: m.description })),
    }
    res.setHeader('Content-Disposition', 'attachment; filename="timeline-data.json"')
    res.json(payload)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── SEED (POST /api/seed — run once to populate Turso) ───────────────

app.post('/api/seed', async (req, res) => {
  // Simple auth check — set SEED_SECRET env var in Vercel
  if (process.env.SEED_SECRET && req.headers['x-seed-secret'] !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const { seedDatabase } = await import('./seed-data.js')
    const counts = await seedDatabase(db)
    res.json({ seeded: true, ...counts })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── HEALTH ────────────────────────────────────────────────────────────

app.get('/api/health', async (_, res) => {
  try {
    await db.execute('SELECT 1')
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
  } catch (e) {
    res.status(500).json({ status: 'error', db: e.message })
  }
})

// ── START ─────────────────────────────────────────────────────────────

app.listen(PORT, () => console.log(`Timeline API on http://localhost:${PORT}`))

export default app