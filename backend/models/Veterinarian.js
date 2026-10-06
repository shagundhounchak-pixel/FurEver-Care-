import mongoose from 'mongoose'

const veterinarianSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  specialization: {
    type: String,
    trim: true,
    default: 'General'
  },
  clinicName: {
    type: String,
    trim: true,
    default: ''
  },
  clinicAddress: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
})

veterinarianSchema.index({ userId: 1 }, { unique: true })

const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema)
export default Veterinarian
