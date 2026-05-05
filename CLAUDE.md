# Kehilla — Community Growth Projection Tool

## What it does
A tool for rabbis and community leaders to input current community data and project how the community will grow under different scenarios. Built for Chabad communities but applicable to any membership-based organisation.

## Architecture
Monorepo with two sub-packages:

```
Kehilla/
├── client/          React + Vite frontend
│   └── src/
│       ├── components/   InputPanel, OutputPanel, ScenarioManager, SummaryCard, Tooltip
│       ├── charts/       MembersLineChart, AgeBarChart (Recharts)
│       └── utils/
│           └── projection.js   Core calculation engine (pure function)
├── server/          Node/Express backend
│   └── src/
│       ├── index.js        Express app, static file serving in production
│       ├── db.js           SQLite via better-sqlite3
│       └── routes/
│           └── scenarios.js  CRUD for saved scenarios
├── Dockerfile
├── railway.json
└── CLAUDE.md
```

## What it reads at runtime
- `server/src/db.js` opens (or creates) `data/kehilla.db` — a SQLite file for scenario persistence
- On Railway, the DB path is `$RAILWAY_VOLUME_MOUNT_PATH/kehilla.db` if a volume is mounted, otherwise `data/kehilla.db` relative to the project root

## What it writes
- `data/kehilla.db` — SQLite database with one table: `scenarios` (id, name, inputs JSON, created_at)
- Scenarios are capped at 3 per instance

## Data model
- **Family** — the atomic unit; every person in an affiliated family is a member
- **Age brackets** — 0–12, 13–17, 18–25, 26–50, 50+
- **Projection** — pure function in `client/src/utils/projection.js`; runs entirely on the frontend

## Projection engine
`project(inputs)` returns an array of year snapshots from year 0 → horizonYears.
Each snapshot: `{ year, families, totalMembers, brackets: { '0–12': n, ... } }`

Age distribution percentages are normalised to sum to 1 before calculation. Families accumulate linearly: `families += joiningPerYear - leavingPerYear` each year.

## Running locally

### Prerequisites
- Node 20+

### Install
```bash
cd Kehilla
npm run install:all
```

### Dev (both client and server)
```bash
npm run dev
```
- Client: http://localhost:5173
- Server: http://localhost:3001

### Build
```bash
npm run build
```

## Environment variables
| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3001` (dev) / `3000` (prod) | Server listen port |
| `NODE_ENV` | `development` | Set to `production` to serve static client files |
| `RAILWAY_VOLUME_MOUNT_PATH` | — | If set, SQLite DB is stored here (Railway persistent volume) |

## Deploying to Railway
1. Push repo to GitHub
2. Create new Railway project → Deploy from GitHub repo
3. Railway detects `Dockerfile` automatically
4. Optionally add a persistent volume mounted at `/data` so scenarios survive redeploys
5. Set `RAILWAY_VOLUME_MOUNT_PATH=/data` in Railway environment variables

The `railway.json` configures the Dockerfile builder and sets the healthcheck path to `/api/health`.
