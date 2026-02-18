import request from 'supertest'
import app from '../../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'
import MatchSession from '../../src/models/MatchSession.js'
import Facility from '../../src/models/Facility.js'
import Coach from '../../src/models/Coach.js'
import Team from '../../src/models/Team.js'

describe('MatchSession CRUD Operations', () => {
  let matchSessionId, facilityId, coachId, teamId

  beforeEach(async () => {
    await MatchSession.deleteMany({})
    await Facility.deleteMany({})
    await Coach.deleteMany({})
    await Team.deleteMany({})

    const facility = await Facility.create({
      name: 'Stadium Match',
      location: 'Paris',
      capacity: 800,
      type: 'indoor'
    })
    facilityId = facility._id.toString()

    const coach = await Coach.create({
      firstName: 'Jean',
      lastName: 'Match',
      email: 'jean@match.com'
    })
    coachId = coach._id.toString()

    const team = await Team.create({
      name: 'Match Team',
      sport: 'Football',
      city: 'Paris'
    })
    teamId = team._id.toString()
  })

  // ========== CREATE ==========
  describe('POST /matchSessions', () => {
    it('should return 400 if eventDate is missing', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({
          eventSlot: 'morning',
          facilityId,
          coachId,
          teamId
        })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should return 400 if eventType is invalid', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({
          eventType: 'invalid',
          eventDate: '2026-06-15T14:00:00Z',
          eventSlot: 'afternoon',
          facilityId,
          coachId,
          teamId
        })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create match session with valid data', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({
          eventDate: '2026-06-15T14:00:00Z',
          eventSlot: 'afternoon',
          facilityId,
          coachId,
          teamId
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.eventSlot).toBe('afternoon')
      expect(response.body.data.eventType).toBe('match') // Vérifier la valeur par défaut
      expect(response.body.data.facilityId._id).toBe(facilityId)
      matchSessionId = response.body.data._id
    })

    it('should create match session with eventType training', async () => {
      const response = await request(app)
        .post('/matchSessions')
        .send({
          eventType: 'training',
          eventDate: '2026-06-16T10:00:00Z',
          eventSlot: 'morning',
          facilityId,
          coachId,
          teamId
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.eventType).toBe('training')
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /matchSessions', () => {
    beforeEach(async () => {
      await MatchSession.create([
        {
          eventDate: '2026-07-10T10:00:00Z',
          eventSlot: 'morning',
          facilityId,
          coachId,
          teamId
        },
        {
          eventDate: '2026-08-20T15:00:00Z',
          eventSlot: 'afternoon',
          facilityId,
          coachId,
          teamId
        }
      ])
    })

    it('should return all match sessions', async () => {
      const response = await request(app)
        .get('/matchSessions')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /matchSessions/:id', () => {
    beforeEach(async () => {
      const matchSession = await MatchSession.create({
        eventDate: '2026-09-05T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        teamId
      })
      matchSessionId = matchSession._id.toString()
    })

    it('should return 404 if match session not found', async () => {
      const response = await request(app)
        .get('/matchSessions/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return match session by id', async () => {
      const response = await request(app)
        .get(`/matchSessions/${matchSessionId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(matchSessionId)
      expect(response.body.data.eventSlot).toBe('afternoon')
    })
  })

  // ========== UPDATE ==========
  describe('PUT /matchSessions/:id', () => {
    beforeEach(async () => {
      const matchSession = await MatchSession.create({
        eventDate: '2026-10-12T10:00:00Z',
        eventSlot: 'morning',
        facilityId,
        coachId,
        teamId
      })
      matchSessionId = matchSession._id.toString()
    })

    it('should return 404 if match session not found', async () => {
      const response = await request(app)
        .put('/matchSessions/507f1f77bcf86cd799439011')
        .send({ eventSlot: 'afternoon' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update match session successfully', async () => {
      const response = await request(app)
        .put(`/matchSessions/${matchSessionId}`)
        .send({
          eventSlot: 'evening',
          eventDate: '2026-10-12T18:00:00Z'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.eventSlot).toBe('evening')
    })
  })

  // ========== DELETE ==========
  describe('DELETE /matchSessions/:id', () => {
    beforeEach(async () => {
      const matchSession = await MatchSession.create({
        eventDate: '2026-11-20T14:00:00Z',
        eventSlot: 'afternoon',
        facilityId,
        coachId,
        teamId
      })
      matchSessionId = matchSession._id.toString()
    })

    it('should return 404 if match session not found', async () => {
      const response = await request(app)
        .delete('/matchSessions/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete match session successfully', async () => {
      const response = await request(app)
        .delete(`/matchSessions/${matchSessionId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      const checkResponse = await request(app)
        .get(`/matchSessions/${matchSessionId}`)
        .expect(404)

      expect(checkResponse.body.success).toBe(false)
    })
  })
})
