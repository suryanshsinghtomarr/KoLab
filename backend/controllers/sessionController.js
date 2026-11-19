const mongoose = require('mongoose')
const Room = require('../models/Room')
const Session = require('../models/Session')

const requireRoomParticipant = (roomId, userId) => Room.findOne({ roomId, participants: userId }).select('_id')

const saveSession = async (req, res) => {
  const { roomId, title, code, language } = req.body
  if (!roomId || !title || typeof code !== 'string' || !language) return res.status(400).json({ message: 'roomId, title, code, and language are required' })
  if (!await requireRoomParticipant(roomId, req.user._id)) return res.status(404).json({ message: 'Room not found' })
  const session = await Session.create({ roomId, owner: req.user._id, title, code, language, savedAt: new Date() })
  res.status(201).json({ session })
}

const getMySessions = async (req, res) => {
  const sessions = await Session.find({ owner: req.user._id }).sort({ savedAt: -1 }).limit(100)
  res.json({ sessions })
}

const getSession = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.sessionId)) return res.status(404).json({ message: 'Session not found' })
  const session = await Session.findOne({ _id: req.params.sessionId, owner: req.user._id })
  if (!session) return res.status(404).json({ message: 'Session not found' })
  res.json({ session })
}

const deleteSession = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.sessionId)) return res.status(404).json({ message: 'Session not found' })
  const result = await Session.deleteOne({ _id: req.params.sessionId, owner: req.user._id })
  if (!result.deletedCount) return res.status(404).json({ message: 'Session not found' })
  res.status(204).end()
}

module.exports = { saveSession, getMySessions, getSession, deleteSession }
