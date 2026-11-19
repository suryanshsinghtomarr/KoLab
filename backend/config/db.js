const mongoose = require('mongoose')
const dns = require('dns')

const connectDB = async () => {
  const dnsServers = (process.env.MONGO_DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean)

  if (dnsServers.length) dns.setServers(dnsServers)

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    if (error.code === 'ECONNREFUSED' && error.syscall === 'querySrv') {
      throw new Error(
        'MongoDB SRV DNS lookup failed. Check MONGO_DNS_SERVERS, your network/VPN, and the Atlas URI.',
      )
    }
    throw error
  }
}

module.exports = connectDB
