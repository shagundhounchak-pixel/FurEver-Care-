import express from 'express'
import auth from '../middleware/auth.js'
import { getReminders, createReminder, updateReminder, toggleReminder, deleteReminder } from '../controllers/reminderController.js'

const router = express.Router()

router.use(auth)

router.route('/')
  .get(getReminders)
  .post(createReminder)

router.route('/:id')
  .put(updateReminder)
  .delete(deleteReminder)

router.patch('/:id/toggle', toggleReminder)

export default router
