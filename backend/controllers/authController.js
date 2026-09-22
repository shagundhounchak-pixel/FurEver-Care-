import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return sendError(res, 'Email already registered.', 400)
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'pet_owner'
    })

    const token = generateToken(user._id)

    sendSuccess(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      token
    }, 201)
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401)
    }

    const token = generateToken(user._id)

    sendSuccess(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return sendError(res, 'User not found.', 404)
    }
    sendSuccess(res, { user })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/logout
export const logout = async (req, res) => {
  // JWT is stateless — client clears token.
  // This endpoint exists for API completeness.
  sendSuccess(res, { message: 'Logged out successfully.' })
}
