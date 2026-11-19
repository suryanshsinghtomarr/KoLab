const Room = require('../models/Room')
const executeCode = require('../services/executionService')

const pendingCode = new Map()
const flushCode = async () => {
  for (const [roomId, code] of pendingCode) {
    pendingCode.delete(roomId)
    await Room.updateOne({ roomId }, { $set: { code } }).catch((error) => console.error('Could not save room code:', error.message))
  }
}
setInterval(flushCode, 1000).unref()

const registerCodeHandlers = (io, socket) => {
  socket.on('code-change', ({ roomId, code } = {}) => {
    if (socket.data.roomId !== roomId || typeof code !== 'string') return
    pendingCode.set(roomId, code)
    socket.to(roomId).emit('code-change', { code })
  })

  socket.on('language-change', ({ roomId, language } = {}) => {
    if (socket.data.roomId !== roomId || typeof language !== 'string') return
    io.to(roomId).emit('language-change', { language })
    Room.updateOne({ roomId }, { $set: { language } }).catch((error) => console.error('Could not save room language:', error.message))
  })

  socket.on('run-code', async ({ roomId, code, language } = {}, callback = () => {}) => {
    if (socket.data.roomId !== roomId || typeof code !== 'string' || typeof language !== 'string') return callback({ error: 'Invalid execution request' })
    io.to(roomId).emit('run-started', { roomId })
    try {
      const output = await executeCode(code, language)
      io.to(roomId).emit('run-output', { roomId, output })
      callback({ ok: true, output })
    } catch (error) {
      callback({ error: error.message || 'Code execution failed' })
    }
  })
}

module.exports = registerCodeHandlers
