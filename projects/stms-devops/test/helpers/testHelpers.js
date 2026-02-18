/**
 * Test helpers for integration tests
 * Provides reusable functions to reduce duplication
 */
import mongoose from 'mongoose'
import Team from '../../src/models/Team.js'
import Coach from '../../src/models/Coach.js'
import Facility from '../../src/models/Facility.js'
import MatchSession from '../../src/models/MatchSession.js'
import TrainingSession from '../../src/models/TrainingSession.js'

/**
 * Clear all collections in the test database
 */
export async function clearDatabase () {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

/**
 * Clear a specific model's collection
 * @param {mongoose.Model} Model - Mongoose model to clear
 */
export async function clearCollection (Model) {
  await Model.deleteMany({})
}

/**
 * Create a team in the database
 * @param {Object} data - Team data (partial)
 * @returns {Promise<Object>} Created team
 */
export async function createTeam (data = {}) {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)

  const team = new Team({
    name: data.name || `Test Team ${timestamp}-${random}`,
    sport: data.sport || 'Football',
    ...data
  })
  return await team.save()
}

/**
 * Create a coach in the database
 * @param {Object} data - Coach data (partial)
 * @returns {Promise<Object>} Created coach
 */
export async function createCoach (data = {}) {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)

  const coach = new Coach({
    firstName: data.firstName || 'John',
    lastName: data.lastName || 'Doe',
    email: data.email || `john.doe.${timestamp}-${random}@test.com`,
    phone: data.phone || '0123456789',
    ...data
  })
  return await coach.save()
}

/**
 * Create a facility in the database
 * @param {Object} data - Facility data (partial)
 * @returns {Promise<Object>} Created facility
 */
export async function createFacility (data = {}) {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)

  const facility = new Facility({
    name: data.name || `Test Facility ${timestamp}-${random}`,
    address: data.address || '123 Test St',
    ...data
  })
  return await facility.save()
}

/**
 * Create a match session in the database
 * @param {Object} data - Match session data (partial)
 * @returns {Promise<Object>} Created match session
 */
export async function createMatchSession (data = {}) {
  // Ensure required references exist
  if (!data.teamId) {
    const team = await createTeam()
    data.teamId = team._id
  }
  if (!data.coachId) {
    const coach = await createCoach()
    data.coachId = coach._id
  }
  if (!data.facilityId) {
    const facility = await createFacility()
    data.facilityId = facility._id
  }

  const matchSession = new MatchSession({
    eventDate: data.eventDate || new Date(),
    eventSlot: data.eventSlot || 'morning',
    opponent: data.opponent || 'Test Opponent',
    type: data.type || 'home',
    ...data
  })
  return await matchSession.save()
}

/**
 * Create a training session in the database
 * @param {Object} data - Training session data (partial)
 * @returns {Promise<Object>} Created training session
 */
export async function createTrainingSession (data = {}) {
  // Ensure required references exist
  if (!data.teamId) {
    const team = await createTeam()
    data.teamId = team._id
  }
  if (!data.coachId) {
    const coach = await createCoach()
    data.coachId = coach._id
  }
  if (!data.facilityId) {
    const facility = await createFacility()
    data.facilityId = facility._id
  }

  const trainingSession = new TrainingSession({
    eventDate: data.eventDate || new Date(),
    eventSlot: data.eventSlot || 'morning',
    duration: data.duration || 90,
    ...data
  })
  return await trainingSession.save()
}
