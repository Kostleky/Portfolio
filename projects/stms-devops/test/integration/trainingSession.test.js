/**
 * Integration tests for TrainingSession CRUD operations
 * Tests HTTP endpoints with real MongoDB operations
 */
import request from 'supertest'
import app from '../../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'
import TrainingSession from '../../src/models/TrainingSession.js'
import { clearCollection, createTrainingSession, createTeam, createFacility, createCoach } from '../helpers/testHelpers.js'
import { trainingSessionFactory, teamFactory, facilityFactory, coachFactory } from '../helpers/factories.js'

describe('TrainingSession CRUD Operations', () => {
  let trainingSessionId, teamId, facilityId, coachId

  beforeEach(async () => {
    await clearCollection(TrainingSession)

    // Create dependencies
    const team = await createTeam(teamFactory())
    const facility = await createFacility(facilityFactory())
    const coach = await createCoach(coachFactory())
    teamId = team._id.toString()
    facilityId = facility._id.toString()
    coachId = coach._id.toString()
  })

  // ========== CREATE ==========
  describe('POST /trainingSessions', () => {
    it('should return 400 if required fields are missing', async () => {
      const invalidData = { duration: 90 }

      const response = await request(app)
        .post('/trainingSessions')
        .send(invalidData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create training session with valid data', async () => {
      const trainingData = trainingSessionFactory({
        teamId,
        facilityId,
        coachId,
        eventDate: new Date().toISOString(),
        eventSlot: 'morning',
        duration: 120
      })

      const response = await request(app)
        .post('/trainingSessions')
        .send(trainingData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.duration).toBe(120)
      trainingSessionId = response.body.data._id
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /trainingSessions', () => {
    beforeEach(async () => {
      await createTrainingSession(trainingSessionFactory({
        teamId,
        facilityId,
        coachId
      }))
      await createTrainingSession(trainingSessionFactory({
        teamId,
        facilityId,
        coachId
      }))
    })

    it('should return all training sessions', async () => {
      const response = await request(app)
        .get('/trainingSessions')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /trainingSessions/:id', () => {
    beforeEach(async () => {
      const training = await createTrainingSession(trainingSessionFactory({
        teamId,
        facilityId,
        coachId,
        duration: 90
      }))
      trainingSessionId = training._id.toString()
    })

    it('should return 404 if training session not found', async () => {
      const response = await request(app)
        .get('/trainingSessions/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return training session by id', async () => {
      const response = await request(app)
        .get(`/trainingSessions/${trainingSessionId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(trainingSessionId)
      expect(response.body.data.duration).toBe(90)
    })
  })

  // ========== UPDATE ==========
  describe('PUT /trainingSessions/:id', () => {
    beforeEach(async () => {
      const training = await createTrainingSession(trainingSessionFactory({
        teamId,
        facilityId,
        coachId,
        duration: 90
      }))
      trainingSessionId = training._id.toString()
    })

    it('should return 404 if training session not found', async () => {
      const response = await request(app)
        .put('/trainingSessions/507f1f77bcf86cd799439011')
        .send({ duration: 120 })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update training session successfully', async () => {
      const response = await request(app)
        .put(`/trainingSessions/${trainingSessionId}`)
        .send({
          duration: 150
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.duration).toBe(150)
    })
  })

  // ========== DELETE ==========
  describe('DELETE /trainingSessions/:id', () => {
    beforeEach(async () => {
      const training = await createTrainingSession(trainingSessionFactory({
        teamId,
        facilityId,
        coachId
      }))
      trainingSessionId = training._id.toString()
    })

    it('should return 404 if training session not found', async () => {
      const response = await request(app)
        .delete('/trainingSessions/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete training session successfully', async () => {
      const response = await request(app)
        .delete(`/trainingSessions/${trainingSessionId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      const checkResponse = await request(app)
        .get(`/trainingSessions/${trainingSessionId}`)
        .expect(404)

      expect(checkResponse.body.success).toBe(false)
    })
  })
})
