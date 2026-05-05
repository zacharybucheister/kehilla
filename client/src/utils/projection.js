export const BRACKETS = ['0–12', '13–17', '18–25', '26–50', '50+']

export const BRACKET_COLORS = {
  '0–12':  '#F59E0B',
  '13–17': '#10B981',
  '18–25': '#6366F1',
  '26–50': '#2C5282',
  '50+':   '#B45309',
}

export const DEFAULT_INPUTS = {
  currentFamilies: 140,
  avgMembersPerFamily: 5.5,
  ageDist: {
    '0–12':  30,
    '13–17': 10,
    '18–25': 8,
    '26–50': 35,
    '50+':   17,
  },
  joiningPerYear: 8,
  leavingPerYear: 3,
  horizonYears: 10,
}

export function project(inputs) {
  const {
    currentFamilies,
    avgMembersPerFamily,
    ageDist,
    joiningPerYear,
    leavingPerYear,
    horizonYears,
  } = inputs

  // Normalise distribution so it always sums to 1
  const rawTotal = Object.values(ageDist).reduce((s, v) => s + Number(v), 0)
  const norm = rawTotal === 0 ? 1 : rawTotal
  const dist = Object.fromEntries(
    Object.entries(ageDist).map(([k, v]) => [k, Number(v) / norm])
  )

  const results = []
  let families = Number(currentFamilies)

  for (let year = 0; year <= Number(horizonYears); year++) {
    const totalMembers = Math.round(families * Number(avgMembersPerFamily))
    const brackets = Object.fromEntries(
      BRACKETS.map(b => [b, Math.round(totalMembers * (dist[b] ?? 0))])
    )
    results.push({ year, families: Math.round(families), totalMembers, brackets })
    families = Math.max(0, families + Number(joiningPerYear) - Number(leavingPerYear))
  }

  return results
}

// Proportionally scale other sliders so the sum stays at 100
export function adjustAgeDist(currentDist, changedKey, newValue) {
  const clamped = Math.max(0, Math.min(100, newValue))
  const others = BRACKETS.filter(b => b !== changedKey)
  const otherTotal = others.reduce((s, b) => s + currentDist[b], 0)
  const remaining = 100 - clamped

  if (otherTotal === 0) {
    const each = remaining / others.length
    return Object.fromEntries(BRACKETS.map(b => [b, b === changedKey ? clamped : each]))
  }

  const scale = remaining / otherTotal
  return Object.fromEntries(
    BRACKETS.map(b => [
      b,
      b === changedKey ? clamped : Math.round(currentDist[b] * scale * 10) / 10,
    ])
  )
}
