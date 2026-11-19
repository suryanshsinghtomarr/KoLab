require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')
const http = require('http')
const createSocketServer = require('./socket')

const port = process.env.PORT || 5000
const server = http.createServer(app)
app.set('io', createSocketServer(server))
connectDB()
  .then(() => server.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`)))
  .catch((error) => { console.error('Database connection failed:', error.message); process.exit(1) })
