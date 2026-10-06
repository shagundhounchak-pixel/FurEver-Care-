import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    default: null
  },
  category: {
    type: String,
    enum: ['medication', 'feeding', 'grooming', 'vet', 'other'],
    default: 'other'
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  recurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'once'],
    default: 'once'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

reminderSchema.index({ active: 1 })

const Reminder = mongoose.model('Reminder', reminderSchema)
export default Reminder
