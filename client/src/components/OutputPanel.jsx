import React, { useState } from 'react'
import SummaryCard from './SummaryCard'
import MembersLineChart from '../charts/MembersLineChart'
import AgeBarChart from '../charts/AgeBarChart'

export default function OutputPanel({ projectionData, scenarios }) {
  const [showFamilies, setShowFamilies] = useState(false)

  if (!projectionData?.length) return null

  const lastPoint = projectionData[projectionData.length - 1]
  const horizonYear = lastPoint.year

  return (
    <section className="output-panel">
      {/* Summary */}
      <SummaryCard data={lastPoint} year={horizonYear} />

      {/* Line chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Growth over time</h3>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showFamilies}
              onChange={e => setShowFamilies(e.target.checked)}
            />
            Show families line
          </label>
        </div>
        <MembersLineChart
          data={projectionData}
          scenarios={scenarios}
          showFamilies={showFamilies}
        />
      </div>

      {/* Bar chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Age distribution — year {horizonYear}</h3>
        </div>
        <AgeBarChart brackets={lastPoint.brackets} />
      </div>
    </section>
  )
}
