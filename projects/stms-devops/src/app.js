import express from 'express'
import cors from 'cors'
import { errorHandler } from './utils/errorHandler.js'

// Import of the routes
import versionRoute from './routes/auto/version.route.js'
import infoRoute from './routes/auto/info.route.js'
import boomRoute from './routes/auto/boom.route.js'

// MongoDB routes (NEW)
import facilityRoute from './routes/auto/facility.route.js'
import coachRoute from './routes/auto/coach.route.js'
import teamRoute from './routes/auto/team.route.js'
import matchSessionRoute from './routes/auto/matchSession.route.js'
import trainingSessionRoute from './routes/auto/trainingSession.route.js'
import authRoute from './routes/auto/auth.route.js'

const app = express()

// CORS - Autoriser les requêtes cross-origin
app.use(cors())

// JSON Middlewares
app.use(express.json())

// Authentication middleware
app.use((req, _res, next) => {
  const authentificationuser = req.headers.authorization || ''
  if (authentificationuser === 'Bearer coach-token') {
    req.user = { id: 1, role: 'coach' }
  } else if (authentificationuser === 'Bearer player-token') {
    req.user = { id: 2, role: 'player' }
  } else {
    req.user = null
  }
  next()
})

// Simple root + health endpoints
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Hello from CI/CD demo' })
})

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// Routes existantes
app.use('/version', versionRoute)
app.use('/info', infoRoute)
app.use('/boom', boomRoute)

// MongoDB Routes (NEW)
app.use('/facilities', facilityRoute)
app.use('/coaches', coachRoute)
app.use('/teams', teamRoute)
app.use('/matchSessions', matchSessionRoute)
app.use('/trainingSessions', trainingSessionRoute)
app.use('/auth', authRoute)

// Global error middleware last
app.use(errorHandler)

export default app
