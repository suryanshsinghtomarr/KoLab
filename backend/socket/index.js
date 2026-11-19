const jwt = require('jsonwebtoken')
const { Server } = require('socket.io')
const User = require('../models/User')
const registerRoomHandlers = require('./roomHandlers')
const registerCodeHandlers = require('./codeHandlers')
const registerChatHandlers = require('./chatHandlers')

const createSocketServer = (httpServer) => {
  const normalizeOrigin = (origin) => origin?.replace(/\/+$/, '')
  const allowedOrigins = new Set([
    normalizeOrigin(process.env.CLIENT_URL),
    'https://ko-lab.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean))
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(normalizeOrigin(origin))) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  })

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      const { id } = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(id).select('name')
      if (!user) return next(new Error('Authentication required'))
      socket.user = { id: user._id.toString(), name: user.name }
      next()
    } catch (error) {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    registerRoomHandlers(io, socket)
    registerCodeHandlers(io, socket)
    registerChatHandlers(io, socket)
  })
  return io
}

module.exports = createSocketServer
