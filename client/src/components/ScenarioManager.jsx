import React, { useState } from 'react'

const SCENARIO_COLORS = ['#C9852A', '#C65D3A', '#059669']

export default function ScenarioManager({ scenarios, onSave, onRemove, onToggle }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onSave(name.trim())
    setName('')
    setSaving(false)
  }

  return (
    <div className="scenario-manager">
      <div className="scenario-header">
        <h3>Scenario comparison</h3>
        <p className="scenario-sub">Save up to 3 named scenarios and overlay them on the chart.</p>
      </div>

      {/* Saved scenarios */}
      {scenarios.length > 0 && (
        <div className="scenario-list">
          {scenarios.map((s, i) => (
            <div key={s.id} className="scenario-chip">
              <span
                className="scenario-dot"
                style={{ background: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }}
              />
              <span className="scenario-name">{s.name}</span>
              <label className="scenario-toggle">
                <input
                  type="checkbox"
                  checked={s.visible}
                  onChange={() => onToggle(s.id)}
                />
                Show
              </label>
              <button
                className="scenario-remove"
                onClick={() => onRemove(s.id)}
                aria-label={`Remove ${s.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save form */}
      {scenarios.length < 3 && (
        <div className="scenario-save">
          <input
            type="text"
            className="scenario-name-input"
            placeholder="Name this scenario…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            maxLength={40}
          />
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!name.trim() || saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {scenarios.length >= 3 && (
        <p className="scenario-limit">Maximum of 3 scenarios reached. Remove one to save another.</p>
      )}
    </div>
  )
}
