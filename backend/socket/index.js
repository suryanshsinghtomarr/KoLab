const jwt = require('jsonwebtoken')
const { Server } = require('socket.io')
const User = require('../models/User')
const registerRoomHandlers = require('./roomHandlers')
const registerCodeHandlers = require('./codeHandlers')
const registerChatHandlers = require('./chatHandlers')

const createSocketServer = (httpServer) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://ko-lab.vercel.app',
    'http://localhost:5173',
  ].filter(Boolean)
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins },
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
