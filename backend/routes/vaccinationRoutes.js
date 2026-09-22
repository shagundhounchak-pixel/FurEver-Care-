import express from 'express'
import auth from '../middleware/auth.js'
import { getVaccinations, addVaccination, updateVaccination, deleteVaccination } from '../controllers/vaccinationController.js'

const router = express.Router()

router.use(auth)

router.route('/')
  .get(getVaccinations)
  .post(addVaccination)

router.route('/:id')
  .put(updateVaccination)
  .delete(deleteVaccination)

export default router
