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

function LegendLine({ color, dashed }) {
  return (
    <svg width="24" height="12" style={{ verticalAlign: 'middle', marginRight: 5 }}>
      <line
        x1="0" y1="6" x2="24" y2="6"
        stroke={color}
        strokeWidth={dashed ? 1.5 : 2.5}
        strokeDasharray={dashed ? '6 3' : undefined}
      />
    </svg>
  )
}

function CustomLegend({ scenarios, showFamilies }) {
  return (
    <div className="chart-legend">
      <span className="legend-item">
        <LegendLine color="#2C5282" dashed={false} />
        Members
      </span>
      {showFamilies && (
        <span className="legend-item">
          <LegendLine color="#2C5282" dashed={true} />
          Families
        </span>
      )}
      {scenarios.filter(s => s.visible).map((s, i) => (
        <span key={s.id} className="legend-item">
          <LegendLine color={SCENARIO_COLORS[i % SCENARIO_COLORS.length]} dashed={true} />
          {s.name}
        </span>
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
        <Legend content={() => <CustomLegend scenarios={scenarios} showFamilies={showFamilies} />} />

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
            strokeDasharray="6 3"
            strokeWidth={1.5}
            dot={false}
          />
        )}

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
