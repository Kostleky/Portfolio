import mongoose from 'mongoose'

// Fonction pour se connecter à MongoDB
export const connectDB = async () => {
  try {
    // Récupérer l'URL de connexion depuis .env
    const mongoURI = process.env.MONGODB_URI

    // Se connecter à MongoDB
    await mongoose.connect(mongoURI)

    // Afficher un message si c'est réussi
    console.log('✅ MongoDB connecté avec succès !')
    console.log(`📍 Base de données : ${mongoose.connection.name}`)
  } catch (error) {
    // Afficher l'erreur si ça n'a pas marché
    console.error('❌ Erreur de connexion à MongoDB :', error.message)
    // Arrêter le programme s'il y a une erreur
    process.exit(1)
  }
}

// Fonction pour se déconnecter (optionnel mais utile pour les tests)
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB déconnecté')
  } catch (error) {
    console.error('❌ Erreur de déconnexion :', error.message)
  }
}
