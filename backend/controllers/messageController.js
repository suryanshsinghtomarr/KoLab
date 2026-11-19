const Message = require('../models/Message')
const Room = require('../models/Room')

const getRoomMessages = async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId, participants: req.user._id }).select('_id')
  if (!room) return res.status(404).json({ message: 'Room not found' })

  const messages = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: 1 })
    .limit(200)
    .populate('sender', 'name')
  res.json({ messages })
}

module.exports = { getRoomMessages }
