import mongoose from 'mongoose'

const trainingSessionSchema = new mongoose.Schema(
  {
    // Type d'événement
    eventType: {
      type: String,
      enum: ['training'],
      default: 'training',
      required: true
    },

    // Date de la séance
    eventDate: {
      type: Date,
      required: true
    },

    // Créneau horaire (ex: "14h00-15h30")
    eventSlot: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50
    },

    // Durée en minutes
    duration: {
      type: Number,
      min: 30, // Minimum 30 minutes
      max: 240, // Maximum 4 heures
      required: true
    },

    // Niveau/Focus de la séance
    trainingLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },

    // Type d'entraînement
    trainingType: {
      type: String,
      enum: ['technical', 'tactical', 'physical', 'mixed'],
      default: 'mixed'
    },

    // Clé étrangère vers Facility
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },

    // Clé étrangère vers Coach
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      required: true
    },

    // Clé étrangère vers Team
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },

    // Nombre maximum de participants
    maxParticipants: {
      type: Number,
      min: 1,
      max: 100,
      default: 25
    },

    // Description de l'entraînement
    description: {
      type: String,
      maxlength: 500
    },

    // Obligatoire ou optionnel
    isMandatory: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'trainingSessions'
  }
)

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema)

export default TrainingSession
