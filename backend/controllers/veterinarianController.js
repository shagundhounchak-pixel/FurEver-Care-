import Veterinarian from '../models/Veterinarian.js'
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// GET /api/veterinarians
export const getVeterinarians = async (req, res, next) => {
  try {
    const vets = await Veterinarian.find()
      .populate('userId', 'name email phone profileImage')
      .sort({ rating: -1 })

    sendSuccess(res, { veterinarians: vets })
  } catch (error) {
    next(error)
  }
}

// GET /api/veterinarians/:id
export const getVeterinarianById = async (req, res, next) => {
  try {
    const vet = await Veterinarian.findById(req.params.id)
      .populate('userId', 'name email phone profileImage')

    if (!vet) {
      return sendError(res, 'Veterinarian not found.', 404)
    }

    sendSuccess(res, { veterinarian: vet })
  } catch (error) {
    next(error)
  }
}

// POST /api/veterinarians
export const createVeterinarian = async (req, res, next) => {
  try {
    // Only users with veterinarian role can create vet profiles
    if (req.user.role !== 'veterinarian' && req.user.role !== 'admin') {
      return sendError(res, 'Only veterinarians can create vet profiles.', 403)
    }

    const existingVet = await Veterinarian.findOne({ userId: req.user._id })
    if (existingVet) {
      return sendError(res, 'Veterinarian profile already exists.', 400)
    }

    const { specialization, clinicName, clinicAddress, phone, availability } = req.body

    const vet = await Veterinarian.create({
      userId: req.user._id,
      specialization: specialization || 'General',
      clinicName: clinicName || '',
      clinicAddress: clinicAddress || '',
      phone: phone || '',
      availability: availability || []
    })

    sendSuccess(res, { veterinarian: vet }, 201)
  } catch (error) {
    next(error)
  }
}

// PUT /api/veterinarians/:id
export const updateVeterinarian = async (req, res, next) => {
  try {
    const vet = await Veterinarian.findById(req.params.id)
    if (!vet) {
      return sendError(res, 'Veterinarian not found.', 404)
    }

    // Only the vet themselves or admin can update
    if (vet.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Access denied.', 403)
    }

    const allowedFields = ['specialization', 'clinicName', 'clinicAddress', 'phone', 'availability']
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        vet[field] = req.body[field]
      }
    })

    await vet.save()
    sendSuccess(res, { veterinarian: vet })
  } catch (error) {
    next(error)
  }
}
