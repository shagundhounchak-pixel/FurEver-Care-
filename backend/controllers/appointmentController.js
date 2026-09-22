import Appointment from '../models/Appointment.js'
import Pet from '../models/Pet.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// GET /api/appointments
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ ownerId: req.user._id })
      .populate('petId', 'name species')
      .populate('veterinarianId')
      .sort({ appointmentDate: -1 })

    sendSuccess(res, { appointments })
  } catch (error) {
    next(error)
  }
}

// POST /api/appointments
export const createAppointment = async (req, res, next) => {
  try {
    const { petId, veterinarianId, appointmentDate, appointmentTime, reason, notes } = req.body

    // Verify pet belongs to this user
    const pet = await Pet.findOne({ _id: petId, ownerId: req.user._id })
    if (!pet) {
      return sendError(res, 'Pet not found.', 404)
    }

    const appointment = await Appointment.create({
      petId,
      ownerId: req.user._id,
      veterinarianId: veterinarianId || null,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'pending',
      notes: notes || ''
    })

    sendSuccess(res, { appointment }, 201)
  } catch (error) {
    next(error)
  }
}

// PUT /api/appointments/:id
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, ownerId: req.user._id })
    if (!appointment) {
      return sendError(res, 'Appointment not found.', 404)
    }

    const allowedFields = ['appointmentDate', 'appointmentTime', 'reason', 'status', 'notes', 'veterinarianId']
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field]
      }
    })

    await appointment.save()
    sendSuccess(res, { appointment })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/appointments/:id
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, ownerId: req.user._id })
    if (!appointment) {
      return sendError(res, 'Appointment not found.', 404)
    }

    appointment.status = 'cancelled'
    await appointment.save()

    sendSuccess(res, { message: 'Appointment cancelled.', appointment })
  } catch (error) {
    next(error)
  }
}
