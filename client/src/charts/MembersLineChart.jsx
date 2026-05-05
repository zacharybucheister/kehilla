import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const SCENARIO_COLORS = ['#C9852A', '#C65D3A', '#059669']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="ct-year">Year {label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

export default function MembersLineChart({ data, scenarios, showFamilies }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" />
        <XAxis
          dataKey="year"
          tickFormatter={v => `Yr ${v}`}
          tick={{ fontSize: 12, fill: '#718096' }}
        />
        <YAxis tick={{ fontSize: 12, fill: '#718096' }} width={55} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 13 }} />

        {/* Active scenario */}
        <Line
          type="monotone"
          dataKey="totalMembers"
          name="Members"
          stroke="#2C5282"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
        {showFamilies && (
          <Line
            type="monotone"
            dataKey="families"
            name="Families"
            stroke="#2C5282"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            dot={false}
          />
        )}

        {/* Saved scenario overlays */}
        {scenarios.filter(s => s.visible).map((s, i) => (
          <Line
            key={s.id}
            data={s.projectionData}
            type="monotone"
            dataKey="totalMembers"
            name={s.name}
            stroke={SCENARIO_COLORS[i % SCENARIO_COLORS.length]}
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
