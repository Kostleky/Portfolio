import mongoose from 'mongoose'

const coachSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Convertir en minuscules
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validation email basique
    },

    specialization: {
      type: String,
      enum: ['Football', 'Rugby', 'Basketball', 'Volleyball', 'Tennis'],
      default: 'Football'
    },

    experience: {
      type: Number, // Années d'expérience
      min: 0,
      max: 70,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },
    phoneNumber: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    collection: 'coaches'
  }
)

const Coach = mongoose.model('Coach', coachSchema)

export default Coach
