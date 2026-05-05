import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { BRACKETS, BRACKET_COLORS } from '../utils/projection'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="ct-year">Ages {label}</p>
      <p style={{ color: payload[0].fill }}>
        Members: <strong>{payload[0].value.toLocaleString()}</strong>
      </p>
    </div>
  )
}

export default function AgeBarChart({ brackets }) {
  const data = BRACKETS.map(b => ({ bracket: b, members: brackets[b] ?? 0 }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false} />
        <XAxis dataKey="bracket" tick={{ fontSize: 12, fill: '#718096' }} />
        <YAxis tick={{ fontSize: 12, fill: '#718096' }} width={45} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="members" radius={[4, 4, 0, 0]}>
          {data.map(entry => (
            <Cell key={entry.bracket} fill={BRACKET_COLORS[entry.bracket]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
