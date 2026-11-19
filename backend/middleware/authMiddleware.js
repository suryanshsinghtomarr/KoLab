const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const { id } = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(id)
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' })
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = protect
