import express from 'express'
import { body } from 'express-validator'
import validate from '../middleware/validate.js'
import auth from '../middleware/auth.js'
import { register, login, getMe, logout } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', validate([
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]), register)

router.post('/login', validate([
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
]), login)

router.get('/me', auth, getMe)
router.post('/logout', auth, logout)

export default router
