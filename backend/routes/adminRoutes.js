import express from 'express'
import auth from '../middleware/auth.js'
import roleAuth from '../middleware/roleAuth.js'
import { getUsers, getAllPets, getAllVeterinarians, getAllAppointments, deleteUser } from '../controllers/adminController.js'

const router = express.Router()

// All admin routes require auth + admin role
router.use(auth, roleAuth('admin'))

router.get('/users', getUsers)
router.get('/pets', getAllPets)
router.get('/veterinarians', getAllVeterinarians)
router.get('/appointments', getAllAppointments)
router.delete('/users/:id', deleteUser)

export default router
