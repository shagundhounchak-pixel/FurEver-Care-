import Vaccination from '../models/Vaccination.js'
import Pet from '../models/Pet.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// GET /api/vaccinations
export const getVaccinations = async (req, res, next) => {
  try {
    const { petId } = req.query

    // Build query — only allow vaccinations for user's own pets
    const userPets = await Pet.find({ ownerId: req.user._id }).select('_id')
    const petIds = userPets.map(p => p._id)

    const filter = { petId: { $in: petIds } }
    if (petId) {
      // Verify the pet belongs to this user
      if (!petIds.some(id => id.toString() === petId)) {
        return sendError(res, 'Pet not found.', 404)
      }
      filter.petId = petId
    }

    const vaccinations = await Vaccination.find(filter)
      .populate('petId', 'name species')
      .sort({ dateGiven: -1 })

    sendSuccess(res, { vaccinations })
  } catch (error) {
    next(error)
  }
}

// POST /api/vaccinations
export const addVaccination = async (req, res, next) => {
  try {
    const { petId, vaccineName, dateGiven, nextDueDate, veterinarian, notes } = req.body

    // Verify pet belongs to this user
    const pet = await Pet.findOne({ _id: petId, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Pet not found.', 404)
    }

    const vaccination = await Vaccination.create({
      petId,
      vaccineName,
      dateGiven,
      nextDueDate: nextDueDate || null,
      veterinarian: veterinarian || '',
      notes: notes || ''
    })

    sendSuccess(res, { vaccination }, 201)
  } catch (error) {
    next(error)
  }
}

// PUT /api/vaccinations/:id
export const updateVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id)
    if (!vaccination) {
      return sendError(res, 'Vaccination record not found.', 404)
    }

    // Verify pet belongs to this user
    const pet = await Pet.findOne({ _id: vaccination.petId, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Access denied.', 403)
    }

    const allowedFields = ['vaccineName', 'dateGiven', 'nextDueDate', 'veterinarian', 'notes']
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        vaccination[field] = req.body[field]
      }
    })

    await vaccination.save()
    sendSuccess(res, { vaccination })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/vaccinations/:id
export const deleteVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id)
    if (!vaccination) {
      return sendError(res, 'Vaccination record not found.', 404)
    }

    // Verify pet belongs to this user
    const pet = await Pet.findOne({ _id: vaccination.petId, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Access denied.', 403)
    }

    await Vaccination.findByIdAndDelete(req.params.id)
    sendSuccess(res, { message: 'Vaccination record deleted.' })
  } catch (error) {
    next(error)
  }
}
