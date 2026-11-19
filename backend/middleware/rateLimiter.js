const rateLimit = require('express-rate-limit')

module.exports = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many executions. Please wait a minute.' },
})
