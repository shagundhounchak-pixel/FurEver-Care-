import Pet from '../models/Pet.js'
import Vaccination from '../models/Vaccination.js'
import Appointment from '../models/Appointment.js'
import Reminder from '../models/Reminder.js'
import { sendSuccess } from '../utils/responseHelper.js'

// GET /api/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id
    const now = new Date()

    // Get user's pets
    const pets = await Pet.find({ ownerId: userId })
    const petIds = pets.map(p => p._id)

    // Total pets
    const totalPets = pets.length

    // Upcoming appointments (future, not cancelled)
    const upcomingAppointments = await Appointment.find({
      ownerId: userId,
      appointmentDate: { $gte: now },
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('petId', 'name species')
      .sort({ appointmentDate: 1 })
      .limit(5)

    // Upcoming vaccinations (nextDueDate in future)
    const upcomingVaccinations = await Vaccination.find({
      petId: { $in: petIds },
      nextDueDate: { $gte: now }
    })
      .populate('petId', 'name')
      .sort({ nextDueDate: 1 })
      .limit(5)

    // Overdue vaccinations (nextDueDate in past)
    const overdueVaccinations = await Vaccination.find({
      petId: { $in: petIds },
      nextDueDate: { $lt: now, $ne: null }
    })
      .populate('petId', 'name')
      .sort({ nextDueDate: 1 })

    // Active reminders
    const activeReminders = await Reminder.find({
      userId,
      active: true
    }).sort({ createdAt: -1 }).limit(10)

    // Recent appointments (completed)
    const recentAppointments = await Appointment.find({
      ownerId: userId,
      status: 'completed'
    })
      .populate('petId', 'name species')
      .sort({ appointmentDate: -1 })
      .limit(5)

    sendSuccess(res, {
      totalPets,
      pets: pets.map(p => ({ _id: p._id, name: p.name, species: p.species, breed: p.breed, weight: p.weight })),
      upcomingAppointments,
      upcomingVaccinations,
      overdueVaccinations: overdueVaccinations.length,
      activeReminders: activeReminders.length,
      recentAppointments
    })
  } catch (error) {
    next(error)
  }
}
