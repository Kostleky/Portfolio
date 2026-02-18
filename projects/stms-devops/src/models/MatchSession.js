import mongoose from 'mongoose'

const matchSessionSchema = new mongoose.Schema(
  {
    // Type d'événement
    eventType: {
      type: String,
      enum: ['match', 'training'], // Seulement ces deux valeurs
      default: 'match',
      required: true
    },

    // Date de l'événement
    eventDate: {
      type: Date,
      required: true
    },

    // Créneau horaire
    eventSlot: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50
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

    opponentTeamName: { // équipe adverse
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    collection: 'matchSessions'
  }
)

const MatchSession = mongoose.model('MatchSession', matchSessionSchema)

export default MatchSession
