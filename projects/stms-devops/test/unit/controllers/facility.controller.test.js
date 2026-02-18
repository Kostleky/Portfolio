import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} from '../../../src/controllers/facility.controller.js'
import Facility from '../../../src/models/Facility.js'

vi.mock('../../../src/models/Facility.js')

describe('Facility Controller - Unit Tests', () => {
  let req, res, next

  beforeEach(() => {
    req = { params: {}, body: {} }
    res = {
      json: vi.fn(),
      status: vi.fn(function () { return this })
    }
    next = vi.fn()
    vi.clearAllMocks()
  })

  describe('listFacilities', () => {
    it('should return all facilities sorted by name', async () => {
      const mockFacilities = [
        { _id: '1', name: 'Facility A', location: 'City A' },
        { _id: '2', name: 'Facility B', location: 'City B' }
      ]

      const sortMock = vi.fn().mockResolvedValue(mockFacilities)
      Facility.find = vi.fn().mockReturnValue({ sort: sortMock })

      await listFacilities(req, res, next)

      expect(Facility.find).toHaveBeenCalled()
      expect(sortMock).toHaveBeenCalledWith({ name: 1 })
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockFacilities
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      Facility.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockRejectedValue(error)
      })

      await listFacilities(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getFacilityById', () => {
    it('should return a facility by id', async () => {
      const mockFacility = { _id: '123', name: 'Test Facility', location: 'Test City' }
      req.params.id = '123'

      Facility.findById = vi.fn().mockResolvedValue(mockFacility)

      await getFacilityById(req, res, next)

      expect(Facility.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockFacility
      })
    })

    it('should return 404 if facility not found', async () => {
      req.params.id = '999'
      Facility.findById = vi.fn().mockResolvedValue(null)

      await getFacilityById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Facility not found'
      })
    })

    it('should call next with error if findById fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Facility.findById = vi.fn().mockRejectedValue(error)

      await getFacilityById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createFacility', () => {
    it('should create a facility successfully', async () => {
      const facilityData = { name: 'New Facility', location: 'New City' }
      const savedFacility = { _id: '456', ...facilityData }

      req.body = facilityData

      const mockFacility = {
        ...facilityData,
        save: vi.fn().mockResolvedValue()
      }
      mockFacility.save.mockImplementation(async function () {
        Object.assign(this, savedFacility)
      })

      Facility.mockImplementation(function () {
        return mockFacility
      })

      await createFacility(req, res, next)

      expect(mockFacility.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Facility created successfully',
        data: mockFacility
      })
    })

    it('should return 400 if name is missing', async () => {
      req.body = { location: 'City Without Name' }

      await createFacility(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name is required'
      })
    })

    it('should call next with error if save fails', async () => {
      const error = new Error('Database error')
      req.body = { name: 'Test Facility', location: 'Test City' }

      const mockSave = vi.fn().mockRejectedValue(error)
      const mockFacility = { ...req.body, save: mockSave }

      Facility.mockImplementation(function () {
        return mockFacility
      })

      await createFacility(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateFacility', () => {
    it('should update a facility successfully', async () => {
      const updatedFacility = { _id: '123', name: 'Updated Facility', location: 'Updated City' }
      req.params.id = '123'
      req.body = { name: 'Updated Facility', location: 'Updated City' }

      Facility.findByIdAndUpdate = vi.fn().mockResolvedValue(updatedFacility)

      await updateFacility(req, res, next)

      expect(Facility.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        req.body,
        { new: true, runValidators: true }
      )
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Facility updated successfully',
        data: updatedFacility
      })
    })

    it('should return 404 if facility not found', async () => {
      req.params.id = '999'
      req.body = { name: 'Updated Facility' }
      Facility.findByIdAndUpdate = vi.fn().mockResolvedValue(null)

      await updateFacility(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Facility not found'
      })
    })

    it('should call next with error if update fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      req.body = { name: 'Updated Facility' }
      Facility.findByIdAndUpdate = vi.fn().mockRejectedValue(error)

      await updateFacility(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteFacility', () => {
    it('should delete a facility successfully', async () => {
      const deletedFacility = { _id: '123', name: 'Deleted Facility' }
      req.params.id = '123'

      Facility.findByIdAndDelete = vi.fn().mockResolvedValue(deletedFacility)

      await deleteFacility(req, res, next)

      expect(Facility.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Facility deleted successfully',
        data: deletedFacility
      })
    })

    it('should return 404 if facility not found', async () => {
      req.params.id = '999'
      Facility.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteFacility(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Facility not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Facility.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteFacility(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
