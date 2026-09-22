import express from 'express'
import auth from '../middleware/auth.js'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js'

const router = express.Router()

router.use(auth)

router.route('/')
  .get(getAppointments)
  .post(createAppointment)

router.route('/:id')
  .put(updateAppointment)
  .delete(deleteAppointment)

export default router
