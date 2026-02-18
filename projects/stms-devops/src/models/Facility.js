import mongoose from 'mongoose'

// Définir la structure du document Facility
const facilitySchema = new mongoose.Schema(
  {
    // Champ 1 : name
    name: {
      type: String,
      required: true, // Obligatoire
      unique: true, // Pas deux facilities avec même nom
      trim: true, // Enlever les espaces avant/après
      minlength: 3, // Au minimum 3 caractères
      maxlength: 100 // Au maximum 100 caractères
    },

    // Champ 2 : location
    location: {
      type: String,
      maxlength: 255,
      default: 'Not specified' // Valeur par défaut
    },

    // Champ 3 : capacity
    capacity: {
      type: Number,
      min: 1, // Au minimum 1
      max: 1000, // Au maximum 1000
      default: 50 // Par défaut 50
    },

    // Champ 4 : type (indoor/outdoor)
    type: {
      type: String,
      enum: ['indoor', 'outdoor', 'hybrid'], // Seulement ces valeurs
      default: 'indoor'
    },

    // Champ 5 : createdAt
    createdAt: {
      type: Date,
      default: Date.now, // Date actuelle
      immutable: true // Ne peut pas être changée
    }
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    collection: 'facilities' // Nom de la collection MongoDB
  }
)

// Créer le modèle (la classe pour interagir avec MongoDB)
const Facility = mongoose.model('Facility', facilitySchema)

export default Facility
