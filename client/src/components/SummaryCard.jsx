import React from 'react'
import { BRACKETS, BRACKET_COLORS } from '../utils/projection'

export default function SummaryCard({ data, year }) {
  if (!data) return null
  const { families, totalMembers, brackets } = data

  return (
    <div className="summary-card">
      <div className="summary-year">Year {year} snapshot</div>
      <div className="summary-metrics">
        <div className="metric">
          <span className="metric-value">{totalMembers.toLocaleString()}</span>
          <span className="metric-label">Total members</span>
        </div>
        <div className="metric">
          <span className="metric-value">{families.toLocaleString()}</span>
          <span className="metric-label">Families</span>
        </div>
      </div>
      <div className="bracket-grid">
        {BRACKETS.map(b => (
          <div key={b} className="bracket-chip" style={{ borderColor: BRACKET_COLORS[b] }}>
            <span className="bc-age" style={{ color: BRACKET_COLORS[b] }}>{b}</span>
            <span className="bc-count">{(brackets[b] ?? 0).toLocaleString()}</span>
            <span className="bc-pct">
              {totalMembers > 0 ? Math.round((brackets[b] / totalMembers) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
