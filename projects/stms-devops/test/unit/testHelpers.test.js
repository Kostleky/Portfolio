/**
 * Unit tests for test/helpers/testHelpers.js
 * Ensures all helper functions work correctly
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  clearDatabase,
  clearCollection,
  createTeam,
  createCoach,
  createFacility,
  createMatchSession,
  createTrainingSession
} from '../helpers/testHelpers.js'
import Team from '../../src/models/Team.js'
import Coach from '../../src/models/Coach.js'
import Facility from '../../src/models/Facility.js'

describe('testHelpers', () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('clearDatabase', () => {
    it('should clear all collections in the database', async () => {
      // Arrange: Create some data
      await createTeam()
      await createCoach()
      await createFacility()

      // Act: Clear database
      await clearDatabase()

      // Assert: All collections should be empty
      const teamCount = await Team.countDocuments()
      const coachCount = await Coach.countDocuments()
      const facilityCount = await Facility.countDocuments()

      expect(teamCount).toBe(0)
      expect(coachCount).toBe(0)
      expect(facilityCount).toBe(0)
    })
  })

  describe('clearCollection', () => {
    it('should clear only the specified collection', async () => {
      // Arrange: Create data in multiple collections
      await createTeam()
      await createCoach()

      // Act: Clear only Team collection
      await clearCollection(Team)

      // Assert: Only Team should be empty
      const teamCount = await Team.countDocuments()
      const coachCount = await Coach.countDocuments()

      expect(teamCount).toBe(0)
      expect(coachCount).toBe(1)
    })
  })

  describe('createTeam', () => {
    it('should create a team with default values', async () => {
      const team = await createTeam()

      expect(team).toBeDefined()
      expect(team._id).toBeDefined()
      expect(team.name).toContain('Test Team')
      expect(team.sport).toBe('Football')
    })

    it('should create a team with custom values', async () => {
      const customData = {
        name: 'Custom Team',
        sport: 'Basketball',
        city: 'Paris'
      }

      const team = await createTeam(customData)

      expect(team.name).toBe('Custom Team')
      expect(team.sport).toBe('Basketball')
      expect(team.city).toBe('Paris')
    })
  })

  describe('createCoach', () => {
    it('should create a coach with default values', async () => {
      const coach = await createCoach()

      expect(coach).toBeDefined()
      expect(coach._id).toBeDefined()
      expect(coach.firstName).toBe('John')
      expect(coach.lastName).toBe('Doe')
      expect(coach.email).toContain('@test.com')
      expect(coach.specialization).toBe('Football')
      expect(coach.experience).toBe(0)
      expect(coach.isActive).toBe(true)
    })

    it('should create a coach with custom values', async () => {
      const customData = {
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie@test.com',
        specialization: 'Basketball',
        experience: 10,
        isActive: false
      }

      const coach = await createCoach(customData)

      expect(coach.firstName).toBe('Marie')
      expect(coach.lastName).toBe('Curie')
      expect(coach.email).toBe('marie@test.com')
      expect(coach.specialization).toBe('Basketball')
      expect(coach.experience).toBe(10)
      expect(coach.isActive).toBe(false)
    })
  })

  describe('createFacility', () => {
    it('should create a facility with default values', async () => {
      const facility = await createFacility()

      expect(facility).toBeDefined()
      expect(facility._id).toBeDefined()
      expect(facility.name).toContain('Test Facility')
      expect(facility.location).toBe('Not specified')
      expect(facility.capacity).toBe(50)
      expect(facility.type).toBe('indoor')
    })

    it('should create a facility with custom values', async () => {
      const customData = {
        name: 'Stadium Central',
        location: 'Paris',
        capacity: 800,
        type: 'outdoor'
      }

      const facility = await createFacility(customData)

      expect(facility.name).toBe('Stadium Central')
      expect(facility.location).toBe('Paris')
      expect(facility.capacity).toBe(800)
      expect(facility.type).toBe('outdoor')
    })
  })

  describe('createMatchSession', () => {
    it('should create match session with auto-generated references', async () => {
      const matchSession = await createMatchSession()

      expect(matchSession).toBeDefined()
      expect(matchSession._id).toBeDefined()
      expect(matchSession.teamId).toBeDefined()
      expect(matchSession.coachId).toBeDefined()
      expect(matchSession.facilityId).toBeDefined()
      expect(matchSession.eventSlot).toBe('morning')
    })

    it('should create match session with provided references', async () => {
      // Arrange: Create references manually
      const team = await createTeam()
      const coach = await createCoach()
      const facility = await createFacility()

      const customData = {
        teamId: team._id,
        coachId: coach._id,
        facilityId: facility._id,
        eventDate: new Date('2026-06-15'),
        eventSlot: 'afternoon'
      }

      // Act
      const matchSession = await createMatchSession(customData)

      // Assert
      expect(matchSession.teamId.toString()).toBe(team._id.toString())
      expect(matchSession.coachId.toString()).toBe(coach._id.toString())
      expect(matchSession.facilityId.toString()).toBe(facility._id.toString())
      expect(matchSession.eventSlot).toBe('afternoon')
    })
  })

  describe('createTrainingSession', () => {
    it('should create training session with auto-generated references', async () => {
      const trainingSession = await createTrainingSession()

      expect(trainingSession).toBeDefined()
      expect(trainingSession._id).toBeDefined()
      expect(trainingSession.teamId).toBeDefined()
      expect(trainingSession.coachId).toBeDefined()
      expect(trainingSession.facilityId).toBeDefined()
      expect(trainingSession.eventSlot).toBe('morning')
      expect(trainingSession.duration).toBe(90)
    })

    it('should create training session with provided references', async () => {
      // Arrange: Create references manually
      const team = await createTeam()
      const coach = await createCoach()
      const facility = await createFacility()

      const customData = {
        teamId: team._id,
        coachId: coach._id,
        facilityId: facility._id,
        eventDate: new Date('2026-07-20'),
        eventSlot: 'evening',
        duration: 120
      }

      // Act
      const trainingSession = await createTrainingSession(customData)

      // Assert
      expect(trainingSession.teamId.toString()).toBe(team._id.toString())
      expect(trainingSession.coachId.toString()).toBe(coach._id.toString())
      expect(trainingSession.facilityId.toString()).toBe(facility._id.toString())
      expect(trainingSession.eventSlot).toBe('evening')
      expect(trainingSession.duration).toBe(120)
    })
  })
})
