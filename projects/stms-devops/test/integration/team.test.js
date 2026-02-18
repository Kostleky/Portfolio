/**
 * Integration tests for Team CRUD operations
 * Tests HTTP endpoints with real MongoDB operations
 */
import request from 'supertest'
import app from '../../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'
import Team from '../../src/models/Team.js'
import { clearCollection, createTeam } from '../helpers/testHelpers.js'
import { teamFactory } from '../helpers/factories.js'

describe('Team CRUD Operations', () => {
  let teamId

  beforeEach(async () => {
    await clearCollection(Team)
  })

  // ========== CREATE ==========
  describe('POST /teams', () => {
    it('should return 400 if name is missing', async () => {
      const invalidData = { sport: 'Football' }

      const response = await request(app)
        .post('/teams')
        .send(invalidData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create team with valid data', async () => {
      const teamData = teamFactory({
        name: 'FC Test',
        sport: 'Football'
      })

      const response = await request(app)
        .post('/teams')
        .send(teamData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('FC Test')
      teamId = response.body.data._id
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /teams', () => {
    beforeEach(async () => {
      await createTeam(teamFactory({ name: 'Team A', sport: 'Football' }))
      await createTeam(teamFactory({ name: 'Team B', sport: 'Basketball' }))
    })

    it('should return all teams', async () => {
      const response = await request(app)
        .get('/teams')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /teams/:id', () => {
    beforeEach(async () => {
      const team = await createTeam(teamFactory({
        name: 'Test Team',
        sport: 'Rugby'
      }))
      teamId = team._id.toString()
    })

    it('should return 404 if team not found', async () => {
      const response = await request(app)
        .get('/teams/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return team by id', async () => {
      const response = await request(app)
        .get(`/teams/${teamId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(teamId)
      expect(response.body.data.name).toBe('Test Team')
    })
  })

  // ========== UPDATE ==========
  describe('PUT /teams/:id', () => {
    beforeEach(async () => {
      const team = await createTeam(teamFactory({
        name: 'Old Name',
        sport: 'Football'
      }))
      teamId = team._id.toString()
    })

    it('should return 404 if team not found', async () => {
      const response = await request(app)
        .put('/teams/507f1f77bcf86cd799439011')
        .send({ name: 'Updated' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update team successfully', async () => {
      const response = await request(app)
        .put(`/teams/${teamId}`)
        .send({
          name: 'New Name',
          sport: 'Basketball'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('New Name')
      expect(response.body.data.sport).toBe('Basketball')
    })
  })

  // ========== DELETE ==========
  describe('DELETE /teams/:id', () => {
    beforeEach(async () => {
      const team = await createTeam(teamFactory({
        name: 'Team to Delete'
      }))
      teamId = team._id.toString()
    })

    it('should return 404 if team not found', async () => {
      const response = await request(app)
        .delete('/teams/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete team successfully', async () => {
      const response = await request(app)
        .delete(`/teams/${teamId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      const checkResponse = await request(app)
        .get(`/teams/${teamId}`)
        .expect(404)

      expect(checkResponse.body.success).toBe(false)
    })
  })
})
