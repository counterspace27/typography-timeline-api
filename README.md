# Timeline API

REST API backend for the Counterspace Typography Timeline. Built with Node.js, Express, Prisma, and SQLite.

## Setup

```bash
npm install
npm run db:migrate    # creates timeline.db and runs migrations
npm run db:seed       # populates with all timeline data
npm run dev           # starts server with file watching on :3001
```

## API Reference

### Typography Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/typography` | List all (supports `?q=`, `?sort=`, `?order=`) |
| GET | `/api/typography/:id` | Get single event |
| POST | `/api/typography` | Create event |
| PATCH | `/api/typography/:id` | Update event (partial) |
| DELETE | `/api/typography/:id` | Delete event |

**Fields:** `year` (Int, negative = BCE), `dateLabel` (String), `name` (String), `description` (String), `imageUrl` (String), `position` ("top" \| "bottom")

### Historical Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/historical` | List all (supports `?q=`, `?sort=`, `?order=`) |
| GET | `/api/historical/:id` | Get single event |
| POST | `/api/historical` | Create event |
| PATCH | `/api/historical/:id` | Update event |
| DELETE | `/api/historical/:id` | Delete event |

**Fields:** `year` (Int), `dateLabel` (String), `name` (String)

### Art Movements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movements` | List all (supports `?q=`, `?sort=`, `?order=`) |
| GET | `/api/movements/:id` | Get single movement |
| POST | `/api/movements` | Create movement |
| PATCH | `/api/movements/:id` | Update movement |
| DELETE | `/api/movements/:id` | Delete movement |

**Fields:** `startYear` (Int), `endYear` (Int), `datesLabel` (String), `name` (String), `description` (String)

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=term` | Search across all three collections |
| GET | `/api/export` | Download timeline-ready JSON |
| GET | `/api/health` | Health check |

## Search

All list endpoints and `/api/search` accept a `?q=` query parameter. Search is case-insensitive and matches against name, description, dateLabel, and year fields.

```bash
# Search within one type
GET /api/typography?q=gutenberg

# Search across everything
GET /api/search?q=roman
```

## Sorting

List endpoints accept `?sort=field&order=asc|desc`:

```bash
GET /api/typography?sort=name&order=asc
GET /api/historical?sort=year&order=desc
GET /api/movements?sort=startYear&order=asc
```

## Export

`GET /api/export` returns a JSON file shaped exactly for the HTML timeline's data arrays — ready to paste in or load dynamically.

## Database

- SQLite file lives at `prisma/timeline.db`
- Run `npm run db:studio` to open Prisma Studio (visual DB browser)
- Run `npm run db:reset` to wipe and re-seed from scratch

## Scripts

```bash
npm run dev          # development with auto-restart
npm run start        # production
npm run db:migrate   # run pending migrations
npm run db:seed      # seed data
npm run db:studio    # open Prisma Studio UI
npm run db:reset     # reset and re-seed
```
