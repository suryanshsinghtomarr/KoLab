const express = require('express')
const { runCode } = require('../controllers/executeController')
const protect = require('../middleware/authMiddleware')
const rateLimiter = require('../middleware/rateLimiter')

const router = express.Router()
router.post('/', protect, rateLimiter, runCode)

module.exports = router
