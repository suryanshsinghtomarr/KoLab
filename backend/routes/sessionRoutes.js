const express = require('express')
const { saveSession, getMySessions, getSession, deleteSession } = require('../controllers/sessionController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
router.use(protect)
router.get('/', getMySessions)
router.post('/', saveSession)
router.get('/:sessionId', getSession)
router.delete('/:sessionId', deleteSession)

module.exports = router
