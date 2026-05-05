const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM scenarios ORDER BY created_at DESC').all()
  res.json(rows.map(r => ({ ...r, inputs: JSON.parse(r.inputs) })))
})

router.post('/', (req, res) => {
  const { name, inputs } = req.body
  if (!name || !inputs) return res.status(400).json({ error: 'name and inputs required' })

  const count = db.prepare('SELECT COUNT(*) as c FROM scenarios').get().c
  if (count >= 3) return res.status(400).json({ error: 'Maximum 3 scenarios allowed. Delete one first.' })

  const result = db.prepare('INSERT INTO scenarios (name, inputs) VALUES (?, ?)').run(name, JSON.stringify(inputs))
  const row = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json({ ...row, inputs: JSON.parse(row.inputs) })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM scenarios WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

module.exports = router
