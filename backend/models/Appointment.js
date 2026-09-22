import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet is required']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  veterinarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Veterinarian',
    default: null
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

appointmentSchema.index({ ownerId: 1 })
appointmentSchema.index({ appointmentDate: 1 })
appointmentSchema.index({ status: 1 })

const Appointment = mongoose.model('Appointment', appointmentSchema)
export default Appointment
