import User from '../models/User.js'
import Pet from '../models/Pet.js'
import Veterinarian from '../models/Veterinarian.js'
import Appointment from '../models/Appointment.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    sendSuccess(res, { users, total: users.length })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/pets
export const getAllPets = async (req, res, next) => {
  try {
    const pets = await Pet.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
    sendSuccess(res, { pets, total: pets.length })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/veterinarians
export const getAllVeterinarians = async (req, res, next) => {
  try {
    const vets = await Veterinarian.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
    sendSuccess(res, { veterinarians: vets, total: vets.length })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('ownerId', 'name email')
      .populate('petId', 'name species')
      .sort({ createdAt: -1 })
    sendSuccess(res, { appointments, total: appointments.length })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return sendError(res, 'User not found.', 404)
    }

    if (user.role === 'admin') {
      return sendError(res, 'Cannot delete admin users.', 403)
    }

    await User.findByIdAndDelete(req.params.id)
    sendSuccess(res, { message: 'User deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
