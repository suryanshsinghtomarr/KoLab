const Room = require('../models/Room')
const Message = require('../models/Message')
const Session = require('../models/Session')
const generateRoomId = require('../utils/generateRoomId')

const resolveRoomName = (room, roomId) => {
  const source = room?.name || room?.roomName || room?.title
  return typeof source === 'string' && source.trim() ? source.trim() : roomId
}

const normalizeRoom = (room) => {
  const value = room.toObject ? room.toObject() : { ...room }
  const name = resolveRoomName(value, value.roomId)
  return { ...value, name, roomName: name, title: name }
}

const createRoom = async (req, res) => {
  let roomId
  do { roomId = generateRoomId() } while (await Room.exists({ roomId }))
  const requestedName = typeof req.body.name === 'string'
    ? req.body.name
    : typeof req.body.roomName === 'string'
      ? req.body.roomName
      : typeof req.body.title === 'string'
        ? req.body.title
        : ''
  const name = requestedName.trim()
  const room = await Room.create({
    roomId,
    name: name || roomId,
    roomName: name || roomId,
    title: name || roomId,
    owner: req.user._id,
    participants: [req.user._id],
    language: req.body.language || 'javascript',
  })
  res.status(201).json({ room: normalizeRoom(room) })
}

const getRoom = async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId }).populate('owner', 'name').populate('participants', 'name email')
  if (!room) return res.status(404).json({ message: 'Room not found' })
  res.json({ room: normalizeRoom(room) })
}

const joinRoom = async (req, res) => {
  const room = await Room.findOneAndUpdate(
    { roomId: req.params.roomId },
    { $addToSet: { participants: req.user._id } },
    { new: true },
  )
  if (!room) return res.status(404).json({ message: 'Room not found' })
  res.json({ room: normalizeRoom(room) })
}

const getMyRooms = async (req, res) => {
  const rooms = await Room.find({ participants: req.user._id }).sort({ updatedAt: -1 }).populate('owner', 'name')
  const normalizedRooms = rooms.map(normalizeRoom)
  res.json({ rooms: normalizedRooms })
}

const deleteRoom = async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId })
  if (!room) return res.status(404).json({ message: 'Room not found' })

  const isOwner = room.owner.equals(req.user._id)
  if (isOwner) {
    await Promise.all([
      Room.deleteOne({ _id: room._id }),
      Message.deleteMany({ roomId: room.roomId }),
      Session.deleteMany({ roomId: room.roomId }),
    ])
  } else {
    const isParticipant = room.participants.some((participant) => participant.equals(req.user._id))
    if (!isParticipant) return res.status(403).json({ message: 'You are not authorized to remove this room' })
    await Room.updateOne({ _id: room._id }, { $pull: { participants: req.user._id } })
    await Session.deleteMany({ roomId: room.roomId, owner: req.user._id })
  }

  res.json({ message: 'Room deleted successfully', roomId: req.params.roomId })
}

module.exports = { createRoom, getRoom, joinRoom, getMyRooms, deleteRoom }
