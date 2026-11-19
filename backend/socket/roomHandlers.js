const Room = require('../models/Room')

const getParticipants = (io, roomId) => Array.from(io.sockets.adapter.rooms.get(roomId) || [])
  .map((socketId) => io.sockets.sockets.get(socketId)?.user)
  .filter(Boolean)
  .map(({ id, name }) => ({ id, name }))

const registerRoomHandlers = (io, socket) => {
  socket.on('join-room', async (roomId, callback = () => {}) => {
    try {
      const room = await Room.findOne({ roomId })
      if (!room) return callback({ error: 'Room not found' })
      await Room.updateOne({ roomId }, { $addToSet: { participants: socket.user.id } })
      await socket.join(roomId)
      socket.data.roomId = roomId
      socket.emit('room-state', { code: room.code, language: room.language })
      io.to(roomId).emit('participants', getParticipants(io, roomId))
      callback({ ok: true })
    } catch (error) {
      callback({ error: 'Could not join room' })
    }
  })

  socket.on('leave-room', async (roomId, callback = () => {}) => {
    await socket.leave(roomId)
    if (socket.data.roomId === roomId) socket.data.roomId = null
    io.to(roomId).emit('participants', getParticipants(io, roomId))
    callback({ ok: true })
  })

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId
    if (roomId) io.to(roomId).emit('participants', getParticipants(io, roomId))
  })
}

module.exports = registerRoomHandlers
