import React from 'react'
import Tooltip from './Tooltip'
import { BRACKETS } from '../utils/projection'

const TOOLTIPS = {
  currentFamilies: 'The number of member families in your community right now.',
  avgMembersPerFamily: 'On average, how many people belong to each family today (adults + children).',
  avgMembersPerJoiningFamily: 'How many members the typical new joining family brings. Usually smaller than the community average as new families tend to be younger.',
  ageDist: 'How your community is spread across age groups today. Enter a % for each bracket — values will be normalised if they don\'t sum to 100.',
  joiningPerYear: 'How many new families you expect to affiliate each year, on average.',
  leavingPerYear: 'How many families you expect to leave or lapse each year, on average.',
  horizonYears: 'How many years into the future to project.',
}

function Field({ label, tooltip, children }) {
  return (
    <div className="field">
      <div className="field-label">
        <span>{label}</span>
        <Tooltip text={tooltip} />
      </div>
      {children}
    </div>
  )
}

export default function InputPanel({ inputs, onChange }) {
  const set = (key, value) => onChange(prev => ({ ...prev, [key]: value }))

  const setAgeDist = (bracket, value) => {
    onChange(prev => ({
      ...prev,
      ageDist: { ...prev.ageDist, [bracket]: value },
    }))
  }

  const totalMembers = Math.round(Number(inputs.currentFamilies) * Number(inputs.avgMembersPerFamily))
  const distTotal = Math.round(Object.values(inputs.ageDist).reduce((s, v) => s + Number(v), 0))
  const distOk = distTotal === 100

  return (
    <aside className="input-panel">
      <div className="panel-header">
        <h2>Community Inputs</h2>
        <p className="panel-subhead">Adjust the numbers to match your community today.</p>
      </div>

      <div className="fields">
        {/* Current families */}
        <Field label="Current families" tooltip={TOOLTIPS.currentFamilies}>
          <input
            type="number"
            className="number-input"
            min={1} max={10000}
            value={inputs.currentFamilies}
            onChange={e => set('currentFamilies', e.target.value)}
          />
        </Field>

        {/* Avg members */}
        <Field label="Average members per family" tooltip={TOOLTIPS.avgMembersPerFamily}>
          <input
            type="number"
            className="number-input"
            min={1} max={20} step={0.1}
            value={inputs.avgMembersPerFamily}
            onChange={e => set('avgMembersPerFamily', e.target.value)}
          />
        </Field>

        {/* Initial age distribution */}
        <Field label="Initial age distribution (%)" tooltip={TOOLTIPS.ageDist}>
          <div className="age-dist-grid">
            <div className="age-grid-header">
              <span>Age group</span>
              <span className="age-grid-pct-head">%</span>
              <span className="age-grid-members-head">Members</span>
            </div>
            {BRACKETS.map(bracket => {
              const pct = Number(inputs.ageDist[bracket]) || 0
              const members = Math.round(totalMembers * pct / 100)
              return (
                <div key={bracket} className="age-grid-row">
                  <span className="age-grid-label">{bracket}</span>
                  <input
                    type="number"
                    className="age-pct-input"
                    min={0} max={100} step={1}
                    value={inputs.ageDist[bracket]}
                    onChange={e => setAgeDist(bracket, e.target.value)}
                  />
                  <span className="age-grid-members">{members.toLocaleString()}</span>
                </div>
              )
            })}
            <div className={`dist-total ${distOk ? 'ok' : 'warn'}`}>
              Total: {distTotal}%{!distOk && ' — will be normalised'}
            </div>
          </div>
        </Field>

        {/* Growth inputs */}
        <div className="field-row">
          <Field label="New families / year" tooltip={TOOLTIPS.joiningPerYear}>
            <input
              type="number"
              className="number-input"
              min={0} max={500}
              value={inputs.joiningPerYear}
              onChange={e => set('joiningPerYear', e.target.value)}
            />
          </Field>
          <Field label="Leaving families / year" tooltip={TOOLTIPS.leavingPerYear}>
            <input
              type="number"
              className="number-input"
              min={0} max={500}
              value={inputs.leavingPerYear}
              onChange={e => set('leavingPerYear', e.target.value)}
            />
          </Field>
        </div>

        {/* Avg members per joining family */}
        <Field label="Avg members per joining family" tooltip={TOOLTIPS.avgMembersPerJoiningFamily}>
          <input
            type="number"
            className="number-input"
            min={1} max={20} step={0.1}
            value={inputs.avgMembersPerJoiningFamily}
            onChange={e => set('avgMembersPerJoiningFamily', e.target.value)}
          />
        </Field>

        {/* Horizon */}
        <Field
          label={`Projection horizon: ${inputs.horizonYears} year${inputs.horizonYears !== 1 ? 's' : ''}`}
          tooltip={TOOLTIPS.horizonYears}
        >
          <div className="horizon-row">
            <span className="horizon-bound">1</span>
            <input
              type="range"
              min={1} max={25} step={1}
              value={inputs.horizonYears}
              onChange={e => set('horizonYears', Number(e.target.value))}
              className="horizon-slider"
            />
            <span className="horizon-bound">25</span>
          </div>
        </Field>
      </div>
    </aside>
  )
}
