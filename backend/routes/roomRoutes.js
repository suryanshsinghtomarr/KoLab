const express = require('express')
const { createRoom, getRoom, joinRoom, getMyRooms, deleteRoom } = require('../controllers/roomController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
router.use(protect)
router.get('/mine', getMyRooms)
router.post('/', createRoom)
router.get('/:roomId', getRoom)
router.post('/:roomId/join', joinRoom)
router.delete('/:roomId', deleteRoom)

module.exports = router
