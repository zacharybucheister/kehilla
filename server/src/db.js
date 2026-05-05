const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, '../../data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'kehilla.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS scenarios (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL,
    inputs TEXT  NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

module.exports = db
