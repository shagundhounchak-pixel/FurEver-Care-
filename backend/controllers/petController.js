import Pet from '../models/Pet.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// GET /api/pets
export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ ownerId: req.user._id }).sort({ createdAt: -1 })
    sendSuccess(res, { pets })
  } catch (error) {
    next(error)
  }
}

// POST /api/pets
export const addPet = async (req, res, next) => {
  try {
    const { name, species, breed, gender, dateOfBirth, weight, color, profileImage, medicalNotes } = req.body

    const pet = await Pet.create({
      name,
      species: species || 'Dog',
      breed: breed || '',
      gender: gender || 'Unknown',
      dateOfBirth: dateOfBirth || null,
      weight: weight || 0,
      color: color || '',
      profileImage: profileImage || '',
      medicalNotes: medicalNotes || '',
      ownerId: req.user._id
    })

    sendSuccess(res, { pet }, 201)
  } catch (error) {
    next(error)
  }
}

// GET /api/pets/:id
export const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Pet not found.', 404)
    }
    sendSuccess(res, { pet })
  } catch (error) {
    next(error)
  }
}

// PUT /api/pets/:id
export const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Pet not found.', 404)
    }

    const allowedFields = ['name', 'species', 'breed', 'gender', 'dateOfBirth', 'weight', 'color', 'profileImage', 'medicalNotes']
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        pet[field] = req.body[field]
      }
    })

    await pet.save()
    sendSuccess(res, { pet })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/pets/:id
export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Pet not found.', 404)
    }
    sendSuccess(res, { message: 'Pet deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
