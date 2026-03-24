import express from 'express'
import cors from 'cors'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

// Prisma connects to SQLite locally (DATABASE_URL=file:./timeline.db)
// In production on Vercel, set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
// and update prisma/schema.prisma provider to use @prisma/adapter-libsql

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  /\.vercel\.app$/,
  process.env.ALLOWED_ORIGIN,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const ok = allowedOrigins.some(o => typeof o === "string" ? o === origin : o.test(origin))
    cb(ok ? null : new Error("Not allowed by CORS"), ok)
  },
  credentials: true,
}))
app.use(express.json())

// ─── helpers ────────────────────────────────────────────────────────
function searchFilter(q) {
  if (!q) return {}
  const term = q.toLowerCase()
  return term
}

function matchesSearch(record, term) {
  if (!term) return true
  const fields = [
    record.name,
    record.dateLabel,
    record.datesLabel,
    record.description,
    String(record.year ?? ''),
    String(record.startYear ?? ''),
    String(record.endYear ?? ''),
  ].filter(Boolean).map(f => f.toLowerCase())
  return fields.some(f => f.includes(term))
}

// ─── TYPOGRAPHY EVENTS ──────────────────────────────────────────────

// GET all (with optional ?q= search and ?sort= / ?order=)
app.get('/api/typography', async (req, res) => {
  try {
    const { q, sort = 'year', order = 'asc' } = req.query
    const validSorts = ['year', 'name', 'createdAt', 'updatedAt']
    const sortField = validSorts.includes(sort) ? sort : 'year'
    const sortOrder = order === 'desc' ? 'desc' : 'asc'

    let events = await prisma.typographyEvent.findMany({
      orderBy: { [sortField]: sortOrder },
    })

    if (q) {
      const term = q.toLowerCase()
      events = events.filter(e => matchesSearch(e, term))
    }

    res.json({ data: events, total: events.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single
app.get('/api/typography/:id', async (req, res) => {
  try {
    const event = await prisma.typographyEvent.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!event) return res.status(404).json({ error: 'Not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CREATE
app.post('/api/typography', async (req, res) => {
  try {
    const { year, dateLabel, name, description, imageUrl, position } = req.body
    if (!year || !name) return res.status(400).json({ error: 'year and name required' })
    const event = await prisma.typographyEvent.create({
      data: {
        year: Number(year),
        dateLabel: dateLabel || formatYear(Number(year)),
        name,
        description: description || '',
        imageUrl: imageUrl || '',
        position: position || 'top',
      },
    })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE (full or partial)
app.patch('/api/typography/:id', async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.year) data.year = Number(data.year)
    delete data.id; delete data.createdAt; delete data.updatedAt
    const event = await prisma.typographyEvent.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(event)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: err.message })
  }
})

// DELETE
app.delete('/api/typography/:id', async (req, res) => {
  try {
    await prisma.typographyEvent.delete({ where: { id: Number(req.params.id) } })
    res.json({ deleted: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: err.message })
  }
})

// ─── HISTORICAL EVENTS ──────────────────────────────────────────────

app.get('/api/historical', async (req, res) => {
  try {
    const { q, sort = 'year', order = 'asc' } = req.query
    const validSorts = ['year', 'name', 'createdAt']
    const sortField = validSorts.includes(sort) ? sort : 'year'
    let events = await prisma.historicalEvent.findMany({
      orderBy: { [sortField]: order === 'desc' ? 'desc' : 'asc' },
    })
    if (q) {
      const term = q.toLowerCase()
      events = events.filter(e => matchesSearch(e, term))
    }
    res.json({ data: events, total: events.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/historical/:id', async (req, res) => {
  try {
    const event = await prisma.historicalEvent.findUnique({ where: { id: Number(req.params.id) } })
    if (!event) return res.status(404).json({ error: 'Not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/historical', async (req, res) => {
  try {
    const { year, dateLabel, name } = req.body
    if (!year || !name) return res.status(400).json({ error: 'year and name required' })
    const event = await prisma.historicalEvent.create({
      data: { year: Number(year), dateLabel: dateLabel || formatYear(Number(year)), name },
    })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/historical/:id', async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.year) data.year = Number(data.year)
    delete data.id; delete data.createdAt; delete data.updatedAt
    const event = await prisma.historicalEvent.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(event)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/historical/:id', async (req, res) => {
  try {
    await prisma.historicalEvent.delete({ where: { id: Number(req.params.id) } })
    res.json({ deleted: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: err.message })
  }
})

// ─── ART MOVEMENTS ──────────────────────────────────────────────────

app.get('/api/movements', async (req, res) => {
  try {
    const { q, sort = 'startYear', order = 'asc' } = req.query
    const validSorts = ['startYear', 'endYear', 'name', 'createdAt']
    const sortField = validSorts.includes(sort) ? sort : 'startYear'
    let movements = await prisma.artMovement.findMany({
      orderBy: { [sortField]: order === 'desc' ? 'desc' : 'asc' },
    })
    if (q) {
      const term = q.toLowerCase()
      movements = movements.filter(m => matchesSearch(m, term))
    }
    res.json({ data: movements, total: movements.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/movements/:id', async (req, res) => {
  try {
    const movement = await prisma.artMovement.findUnique({ where: { id: Number(req.params.id) } })
    if (!movement) return res.status(404).json({ error: 'Not found' })
    res.json(movement)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/movements', async (req, res) => {
  try {
    const { startYear, endYear, datesLabel, name, description } = req.body
    if (!startYear || !endYear || !name) {
      return res.status(400).json({ error: 'startYear, endYear, and name required' })
    }
    const movement = await prisma.artMovement.create({
      data: {
        startYear: Number(startYear),
        endYear: Number(endYear),
        datesLabel: datesLabel || `${formatYear(Number(startYear))}–${formatYear(Number(endYear))}`,
        name,
        description: description || '',
      },
    })
    res.status(201).json(movement)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/movements/:id', async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.startYear) data.startYear = Number(data.startYear)
    if (data.endYear)   data.endYear   = Number(data.endYear)
    delete data.id; delete data.createdAt; delete data.updatedAt
    const movement = await prisma.artMovement.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(movement)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/movements/:id', async (req, res) => {
  try {
    await prisma.artMovement.delete({ where: { id: Number(req.params.id) } })
    res.json({ deleted: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
    res.status(500).json({ error: err.message })
  }
})

// ─── GLOBAL SEARCH ──────────────────────────────────────────────────

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ typography: [], historical: [], movements: [] })

    const term = q.toLowerCase()

    const [typo, hist, art] = await Promise.all([
      prisma.typographyEvent.findMany({ orderBy: { year: 'asc' } }),
      prisma.historicalEvent.findMany({ orderBy: { year: 'asc' } }),
      prisma.artMovement.findMany({ orderBy: { startYear: 'asc' } }),
    ])

    res.json({
      typography: typo.filter(e => matchesSearch(e, term)),
      historical:  hist.filter(e => matchesSearch(e, term)),
      movements:   art.filter(e  => matchesSearch(e, term)),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── EXPORT (generates timeline-ready JSON) ─────────────────────────

app.get('/api/export', async (req, res) => {
  try {
    const [typography, historical, movements] = await Promise.all([
      prisma.typographyEvent.findMany({ orderBy: { year: 'asc' } }),
      prisma.historicalEvent.findMany({ orderBy: { year: 'asc' } }),
      prisma.artMovement.findMany({ orderBy: { startYear: 'asc' } }),
    ])

    // Shape matches what the HTML timeline expects
    const payload = {
      exportedAt: new Date().toISOString(),
      typoEvents: typography.map(e => ({
        year: e.year,
        dateLabel: e.dateLabel,
        name: e.name,
        desc: e.description,
        img: e.imageUrl,
        pos: e.position,
      })),
      histEvents: historical.map(e => ({
        year: e.year,
        dateLabel: e.dateLabel,
        name: e.name,
      })),
      artMovements: movements.map(m => ({
        start: m.startYear,
        end: m.endYear,
        datesLabel: m.datesLabel,
        name: m.name,
        desc: m.description,
      })),
    }

    res.setHeader('Content-Disposition', 'attachment; filename="timeline-data.json"')
    res.json(payload)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── HEALTH ─────────────────────────────────────────────────────────

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ─── UTILS ──────────────────────────────────────────────────────────

function formatYear(y) {
  return y <= 0 ? `${Math.abs(y)} BCE` : `${y} CE`
}

// ─── START ──────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Timeline API running on http://localhost:${PORT}`)
})

export default app
