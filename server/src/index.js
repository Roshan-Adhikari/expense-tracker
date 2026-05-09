import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 4000

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'expense-tracker-api' })
})

app.get('/api/version', (_req, res) => {
  res.json({ version: '0.0.1' })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
