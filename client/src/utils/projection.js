export const BRACKETS = ['0–12', '13–17', '18–25', '26–50', '50+']

export const BRACKET_COLORS = {
  '0–12':  '#F59E0B',
  '13–17': '#10B981',
  '18–25': '#6366F1',
  '26–50': '#2C5282',
  '50+':   '#B45309',
}

// Fraction of each bracket that ages into the next one per year.
// Derived from bracket width (years). 50+ uses a 25-year attrition rate.
const AGING_RATES = {
  '0–12':  1 / 13,
  '13–17': 1 / 5,
  '18–25': 1 / 8,
  '26–50': 1 / 25,
  '50+':   1 / 25,
}

// Default ageDist is in raw member counts (140 families × 5.5 avg = 770 total)
export const DEFAULT_INPUTS = {
  currentFamilies: 140,
  avgMembersPerFamily: 5.5,
  avgMembersPerJoiningFamily: 4.5,
  ageDist: {
    '0–12':  231,
    '13–17': 77,
    '18–25': 62,
    '26–50': 269,
    '50+':   131,
  },
  joiningPerYear: 4,
  leavingPerYear: 1,
  horizonYears: 10,
}

function normalise(dist) {
  const total = Object.values(dist).reduce((s, v) => s + Number(v), 0)
  if (total === 0) return Object.fromEntries(BRACKETS.map(b => [b, 1 / BRACKETS.length]))
  return Object.fromEntries(BRACKETS.map(b => [b, Number(dist[b]) / total]))
}

export function project(inputs) {
  const {
    currentFamilies,
    avgMembersPerFamily,
    avgMembersPerJoiningFamily,
    ageDist,
    joiningPerYear,
    leavingPerYear,
    horizonYears,
  } = inputs

  // Normalised initial distribution — used throughout as the inflow profile for new families
  const initDist = normalise(ageDist)

  // Initialise bracket populations from year-0 totals
  const totalStart = Math.round(Number(currentFamilies) * Number(avgMembersPerFamily))
  let pop = Object.fromEntries(BRACKETS.map(b => [b, totalStart * initDist[b]]))
  let families = Number(currentFamilies)

  const results = []

  for (let year = 0; year <= Number(horizonYears); year++) {
    const totalMembers = Math.round(BRACKETS.reduce((s, b) => s + pop[b], 0))
    results.push({
      year,
      families: Math.round(families),
      totalMembers,
      brackets: Object.fromEntries(BRACKETS.map(b => [b, Math.round(pop[b])])),
    })

    // ── Cohort aging ──────────────────────────────────────────
    const aged = Object.fromEntries(BRACKETS.map(b => [b, pop[b] * AGING_RATES[b]]))

    const next = {
      '0–12':  pop['0–12']  - aged['0–12'],
      '13–17': pop['13–17'] - aged['13–17'] + aged['0–12'],
      '18–25': pop['18–25'] - aged['18–25'] + aged['13–17'],
      '26–50': pop['26–50'] - aged['26–50'] + aged['18–25'],
      '50+':   pop['50+']   - aged['50+']   + aged['26–50'],
      // aged['50+'] exits the system (mortality / permanent departure)
    }

    // ── New families joining ──────────────────────────────────
    const inflow = Number(joiningPerYear) * Number(avgMembersPerJoiningFamily)
    BRACKETS.forEach(b => { next[b] += inflow * initDist[b] })

    // ── Families leaving — remove proportionally from current pop ─
    const currentTotal = BRACKETS.reduce((s, b) => s + next[b], 0)
    const outflow = Number(leavingPerYear) * Number(avgMembersPerFamily)
    if (currentTotal > 0) {
      BRACKETS.forEach(b => {
        next[b] -= outflow * (next[b] / currentTotal)
      })
    }

    // Clamp negatives
    BRACKETS.forEach(b => { next[b] = Math.max(0, next[b]) })

    pop = next
    families = Math.max(0, families + Number(joiningPerYear) - Number(leavingPerYear))
  }

  return results
}
