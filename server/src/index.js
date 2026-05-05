const express = require('express')
const cors = require('cors')
const path = require('path')

const scenariosRouter = require('./routes/scenarios')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/scenarios', scenariosRouter)

// Serve built client in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../public')
  app.use(express.static(staticPath))
  app.get('*', (req, res) => res.sendFile(path.join(staticPath, 'index.html')))
}

app.listen(PORT, () => console.log(`Kehilla server running on :${PORT}`))
