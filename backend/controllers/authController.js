const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email })

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    if (await User.exists({ email: email.toLowerCase().trim() })) return res.status(409).json({ message: 'Email is already registered' })

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: await bcrypt.hash(password, 10) })
    res.status(201).json({ user: publicUser(user), token: tokenFor(user._id) })
  } catch (error) {
    console.error('Registration failed:', error)
    res.status(500).json({ message: 'Unable to create account. Please try again.' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email?.toLowerCase().trim() }).select('+password')
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({ user: publicUser(user), token: tokenFor(user._id) })
  } catch (error) {
    console.error('Login failed:', error)
    res.status(500).json({ message: 'Unable to log in. Please try again.' })
  }
}

const getMe = (req, res) => res.json({ user: publicUser(req.user) })

module.exports = { register, login, getMe }
