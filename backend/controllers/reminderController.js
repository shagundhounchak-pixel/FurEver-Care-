import Reminder from '../models/Reminder.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// GET /api/reminders
export const getReminders = async (req, res, next) => {
  try {
    const { category } = req.query
    const filter = { userId: req.user._id }

    if (category && category !== 'all') {
      filter.category = category
    }

    const reminders = await Reminder.find(filter)
      .populate('petId', 'name')
      .sort({ createdAt: -1 })

    sendSuccess(res, { reminders })
  } catch (error) {
    next(error)
  }
}

// POST /api/reminders
export const createReminder = async (req, res, next) => {
  try {
    const { petId, category, title, description, time, recurring, frequency } = req.body

    const reminder = await Reminder.create({
      userId: req.user._id,
      petId: petId || null,
      category: category || 'other',
      title,
      description: description || '',
      time,
      recurring: recurring || false,
      frequency: frequency || 'once',
      active: true
    })

    sendSuccess(res, { reminder }, 201)
  } catch (error) {
    next(error)
  }
}

// PUT /api/reminders/:id
export const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id })
    if (!reminder) {
      return sendError(res, 'Reminder not found.', 404)
    }

    const allowedFields = ['category', 'title', 'description', 'time', 'recurring', 'frequency', 'active', 'petId']
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        reminder[field] = req.body[field]
      }
    })

    await reminder.save()
    sendSuccess(res, { reminder })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/reminders/:id/toggle
export const toggleReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id })
    if (!reminder) {
      return sendError(res, 'Reminder not found.', 404)
    }

    reminder.active = !reminder.active
    await reminder.save()

    sendSuccess(res, { reminder })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/reminders/:id
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!reminder) {
      return sendError(res, 'Reminder not found.', 404)
    }

    sendSuccess(res, { message: 'Reminder deleted.' })
  } catch (error) {
    next(error)
  }
}
