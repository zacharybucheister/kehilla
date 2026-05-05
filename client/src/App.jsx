import React, { useState, useMemo, useEffect } from 'react'
import InputPanel from './components/InputPanel'
import OutputPanel from './components/OutputPanel'
import ScenarioManager from './components/ScenarioManager'
import { DEFAULT_INPUTS, project } from './utils/projection'

const API = '/api/scenarios'

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [scenarios, setScenarios] = useState([]) // {id, name, inputs, projectionData, visible}

  // Load saved scenarios on mount
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(rows => {
        setScenarios(
          rows.map(row => ({
            ...row,
            projectionData: project(row.inputs),
            visible: true,
          }))
        )
      })
      .catch(() => {}) // server may not be running in dev; silent fail
  }, [])

  const projectionData = useMemo(() => project(inputs), [inputs])

  const saveScenario = async (name) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, inputs }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error)
        return
      }
      const saved = await res.json()
      setScenarios(prev => [
        ...prev,
        { ...saved, projectionData: project(saved.inputs), visible: true },
      ])
    } catch {
      // Offline fallback: store in local state only
      const id = Date.now()
      setScenarios(prev => [
        ...prev,
        { id, name, inputs: { ...inputs }, projectionData: project(inputs), visible: true },
      ])
    }
  }

  const removeScenario = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
    } catch {}
    setScenarios(prev => prev.filter(s => s.id !== id))
  }

  const toggleScenario = (id) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-hebrew">קהילה</span>
            <span className="brand-name">Kehilla</span>
          </div>
          <p className="header-tagline">Community growth projection tool</p>
        </div>
      </header>

      <main className="app-main">
        <InputPanel inputs={inputs} onChange={setInputs} />
        <div className="right-column">
          <OutputPanel projectionData={projectionData} scenarios={scenarios} />
          <ScenarioManager
            scenarios={scenarios}
            onSave={saveScenario}
            onRemove={removeScenario}
            onToggle={toggleScenario}
          />
        </div>
      </main>
    </div>
  )
}
