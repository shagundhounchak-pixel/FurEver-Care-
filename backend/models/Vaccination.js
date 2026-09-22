import mongoose from 'mongoose'

const vaccinationSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet is required']
  },
  vaccineName: {
    type: String,
    required: [true, 'Vaccine name is required'],
    trim: true
  },
  dateGiven: {
    type: Date,
    required: [true, 'Date given is required']
  },
  nextDueDate: {
    type: Date,
    default: null
  },
  veterinarian: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

vaccinationSchema.index({ petId: 1 })
vaccinationSchema.index({ nextDueDate: 1 })

const Vaccination = mongoose.model('Vaccination', vaccinationSchema)
export default Vaccination
