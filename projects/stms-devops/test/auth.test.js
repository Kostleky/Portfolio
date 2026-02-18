import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src/app.js'
import User from '../src/models/User.js'

process.env.JWT_SECRET = 'test_secret'

describe('Authentication endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  // ================= REGISTER =================
  describe('POST /auth/register', () => {
    it('returns 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com' })
        .expect(400)

      expect(res.body.error).toBe(true)
    })

    it('creates a user with valid data', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'player@test.com',
          password: 'password123',
          role: 'player'
        })
        .expect(201)

      expect(res.body.email).toBe('player@test.com')
      expect(res.body.role).toBe('player')
      expect(res.body.password).toBeUndefined()
    })

    it('returns 409 if user already exists', async () => {
      await User.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'duplicate@test.com',
        password: 'hashed',
        role: 'player'
      })

      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'duplicate@test.com',
          password: 'password123',
          role: 'player'
        })
        .expect(409)

      expect(res.body.error).toBe(true)
    })
  })

  // ================= LOGIN =================
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Coach',
          lastName: 'Test',
          email: 'login@test.com',
          password: 'password123',
          role: 'coach'
        })
    })

    it('returns 401 if credentials are invalid', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(res.body.error).toBe(true)
    })

    it('returns a JWT token when credentials are valid', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@test.com',
          password: 'password123'
        })
        .expect(200)

      expect(res.body.token).toBeDefined()
      expect(typeof res.body.token).toBe('string')
    })
  })
})
