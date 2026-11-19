const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoutes')
const messageRoutes = require('./routes/messageRoutes')
const executeRoutes = require('./routes/executeRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()
const normalizeOrigin = (origin) => origin?.replace(/\/+$/, '')
const allowedOrigins = new Set([
  normalizeOrigin(process.env.CLIENT_URL),
  'https://ko-lab.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean))

const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin)
    if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/rooms', messageRoutes)
app.use('/api/execute', executeRoutes)
app.use('/api/sessions', sessionRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
