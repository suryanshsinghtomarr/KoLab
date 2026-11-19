const Room = require('../models/Room')
const executeCode = require('../services/executionService')

const runCode = async (req, res) => {
  const { roomId, code, language } = req.body
  if (!roomId || typeof code !== 'string' || typeof language !== 'string') {
    return res.status(400).json({ message: 'roomId, code, and language are required' })
  }
  const room = await Room.findOne({ roomId, participants: req.user._id }).select('_id')
  if (!room) return res.status(404).json({ message: 'Room not found' })

  const io = req.app.get('io')
  io?.to(roomId).emit('run-started', { roomId })
  try {
    const output = await executeCode(code, language)
    io?.to(roomId).emit('run-output', { roomId, output })
    res.json({ output })
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Code execution failed'
    io?.to(roomId).emit('run-output', { roomId, output: { stdout: '', stderr: message, compileOutput: '', status: 'Failed' } })
    res.status(502).json({ message })
  }
}

module.exports = { runCode }
