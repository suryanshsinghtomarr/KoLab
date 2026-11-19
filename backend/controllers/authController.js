const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email })

const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' })
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' })

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
  res.status(201).json({ user: publicUser(user), token: tokenFor(user._id) })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password')
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  res.json({ user: publicUser(user), token: tokenFor(user._id) })
}

const getMe = (req, res) => res.json({ user: publicUser(req.user) })

module.exports = { register, login, getMe }
