import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'

// Route imports
import authRoutes from './routes/authRoutes.js'
import petRoutes from './routes/petRoutes.js'
import vaccinationRoutes from './routes/vaccinationRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import veterinarianRoutes from './routes/veterinarianRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import reminderRoutes from './routes/reminderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import healthCheckRoutes from './routes/healthCheckRoutes.js'
import pawbotRoutes from './routes/pawbotRoutes.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '50mb' })) // increased limit for images
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/pets', petRoutes)
app.use('/api/vaccinations', vaccinationRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/veterinarians', veterinarianRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reminders', reminderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/health-check', healthCheckRoutes)
app.use('/api/pawbot', pawbotRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'FurEver Care API is running 🐾' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`
  })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🐾 FurEver Care API running on port ${PORT}`)
  console.log(`📡 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
})
