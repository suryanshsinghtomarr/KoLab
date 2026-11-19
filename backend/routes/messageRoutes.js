const express = require('express')
const { getRoomMessages } = require('../controllers/messageController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
router.get('/:roomId/messages', protect, getRoomMessages)

module.exports = router
