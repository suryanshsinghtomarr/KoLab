const Message = require('../models/Message')

const registerChatHandlers = (io, socket) => {
  socket.on('send-message', async ({ roomId, text } = {}, callback = () => {}) => {
    if (socket.data.roomId !== roomId || typeof text !== 'string' || !text.trim()) return callback({ error: 'Invalid message' })
    try {
      const message = await Message.create({ roomId, sender: socket.user.id, text: text.trim().slice(0, 2000) })
      const populated = await message.populate('sender', 'name')
      io.to(roomId).emit('new-message', populated)
      callback({ ok: true })
    } catch (error) {
      callback({ error: 'Could not send message' })
    }
  })
}

module.exports = registerChatHandlers
