const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    code: { type: String, default: '' },
    language: { type: String, required: true, trim: true, maxlength: 40 },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Session', sessionSchema)
