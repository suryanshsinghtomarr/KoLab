const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    name: { type: String, trim: true, default: '' },
    roomName: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    language: { type: String, default: 'javascript', trim: true },
    code: { type: String, default: '' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Room', roomSchema)
