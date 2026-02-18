import 'dotenv/config' // Charger les variables .env
import app from './app.js'
import { connectDB } from './config/database.js'

const PORT = process.env.PORT || 3000

// Fonction async pour pouvoir utiliser await
const startServer = async () => {
  try {
    // 1. D'abord, se connecter à MongoDB
    console.log('🔌 Connexion à MongoDB...')
    await connectDB()

    // 2. Ensuite, démarrer le serveur
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  ✅ Serveur démarré                    ║
║  📍 Port: ${PORT}                       ║
║  🗄️  Base de données: MongoDB           ║
║  🌐 http://localhost:${PORT}            ║
╚════════════════════════════════════════╝
      `)
    })
  } catch (error) {
    console.error('❌ Erreur au démarrage :', error.message)
    process.exit(1)
  }
}

// Lancer la fonction
startServer()
