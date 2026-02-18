/**
 * Integration tests for Facility CRUD operations
 * Tests HTTP endpoints with real MongoDB operations
 */
import request from 'supertest'
import app from '../../src/app.js'
import { describe, it, expect, beforeEach } from 'vitest'
import Facility from '../../src/models/Facility.js'
import { clearCollection, createFacility } from '../helpers/testHelpers.js'
import { facilityFactory } from '../helpers/factories.js'

describe('Facility CRUD Operations', () => {
  let facilityId

  beforeEach(async () => {
    await clearCollection(Facility)
  })

  // ========== CREATE ==========
  describe('POST /facilities', () => {
    it('should return 400 if name is missing', async () => {
      const invalidData = { address: '123 Street' }

      const response = await request(app)
        .post('/facilities')
        .send(invalidData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should create facility with valid data', async () => {
      const facilityData = facilityFactory({
        name: 'Stadium Test',
        address: '456 Main St'
      })

      const response = await request(app)
        .post('/facilities')
        .send(facilityData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Stadium Test')
      facilityId = response.body.data._id
    })
  })

  // ========== READ (LIST) ==========
  describe('GET /facilities', () => {
    beforeEach(async () => {
      await createFacility(facilityFactory({ name: 'Facility A' }))
      await createFacility(facilityFactory({ name: 'Facility B' }))
    })

    it('should return all facilities', async () => {
      const response = await request(app)
        .get('/facilities')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })

  // ========== READ (BY ID) ==========
  describe('GET /facilities/:id', () => {
    beforeEach(async () => {
      const facility = await createFacility(facilityFactory({
        name: 'Test Facility',
        address: '789 Test Ave'
      }))
      facilityId = facility._id.toString()
    })

    it('should return 404 if facility not found', async () => {
      const response = await request(app)
        .get('/facilities/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return facility by id', async () => {
      const response = await request(app)
        .get(`/facilities/${facilityId}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(facilityId)
      expect(response.body.data.name).toBe('Test Facility')
    })
  })

  // ========== UPDATE ==========
  describe('PUT /facilities/:id', () => {
    beforeEach(async () => {
      const facility = await createFacility(facilityFactory({
        name: 'Old Facility'
      }))
      facilityId = facility._id.toString()
    })

    it('should return 404 if facility not found', async () => {
      const response = await request(app)
        .put('/facilities/507f1f77bcf86cd799439011')
        .send({ name: 'Updated' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should update facility successfully', async () => {
      const response = await request(app)
        .put(`/facilities/${facilityId}`)
        .send({
          name: 'Updated Facility',
          address: 'New Address 123'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Updated Facility')
    })
  })

  // ========== DELETE ==========
  describe('DELETE /facilities/:id', () => {
    beforeEach(async () => {
      const facility = await createFacility(facilityFactory({
        name: 'Facility to Delete'
      }))
      facilityId = facility._id.toString()
    })

    it('should return 404 if facility not found', async () => {
      const response = await request(app)
        .delete('/facilities/507f1f77bcf86cd799439011')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should delete facility successfully', async () => {
      const response = await request(app)
        .delete(`/facilities/${facilityId}`)
        .expect(200)

      expect(response.body.success).toBe(true)

      const checkResponse = await request(app)
        .get(`/facilities/${facilityId}`)
        .expect(404)

      expect(checkResponse.body.success).toBe(false)
    })
  })
})
