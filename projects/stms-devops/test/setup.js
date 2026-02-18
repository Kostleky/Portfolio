// test/setup.js
import { beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

beforeAll(async () => {
  console.log('✅ MongoDB Memory Server started')
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()

  // Fermer toute connexion existante avant de se reconnecter
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  await mongoose.connect(uri)
})

afterAll(async () => {
  console.log('✅ MongoDB Memory Server stopped')
  await mongoose.disconnect()
  await mongoServer.stop()
})
