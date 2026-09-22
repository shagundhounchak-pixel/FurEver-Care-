import express from 'express'
import auth from '../middleware/auth.js'
import { getPets, addPet, getPetById, updatePet, deletePet } from '../controllers/petController.js'

const router = express.Router()

router.use(auth)

router.route('/')
  .get(getPets)
  .post(addPet)

router.route('/:id')
  .get(getPetById)
  .put(updatePet)
  .delete(deletePet)

export default router
