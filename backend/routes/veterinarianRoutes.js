import express from 'express'
import auth from '../middleware/auth.js'
import { getVeterinarians, getVeterinarianById, createVeterinarian, updateVeterinarian } from '../controllers/veterinarianController.js'

const router = express.Router()

// Public routes
router.get('/', getVeterinarians)
router.get('/:id', getVeterinarianById)

// Protected routes
router.post('/', auth, createVeterinarian)
router.put('/:id', auth, updateVeterinarian)

export default router
