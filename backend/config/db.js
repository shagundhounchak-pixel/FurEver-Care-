import mongoose from 'mongoose'

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI)
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
      return
    } catch (error) {
      console.error(`❌ MongoDB Connection Error (attempt ${i + 1}/${retries}): ${error.message}`)
      if (i < retries - 1) {
        const delay = Math.min(1000 * 2 ** i, 10000)
        console.log(`⏳ Retrying in ${delay / 1000}s...`)
        await new Promise(res => setTimeout(res, delay))
      }
    }
  }
  console.error('❌ All MongoDB connection attempts failed. Exiting.')
  process.exit(1)
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`)
})

export default connectDB
