import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach
} from '../../../src/controllers/coach.controller.js'
import Coach from '../../../src/models/Coach.js'

vi.mock('../../../src/models/Coach.js')

describe('Coach Controller - Unit Tests', () => {
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

  describe('listCoaches', () => {
    it('should return all coaches sorted by name', async () => {
      const mockCoaches = [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com' }
      ]

      const sortMock = vi.fn().mockResolvedValue(mockCoaches)
      Coach.find = vi.fn().mockReturnValue({ sort: sortMock })

      await listCoaches(req, res, next)

      expect(Coach.find).toHaveBeenCalled()
      expect(sortMock).toHaveBeenCalledWith({ lastName: 1, firstName: 1 })
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockCoaches
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      Coach.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockRejectedValue(error)
      })

      await listCoaches(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getCoachById', () => {
    it('should return a coach by id', async () => {
      const mockCoach = { _id: '123', firstName: 'Test', lastName: 'Coach', email: 'test@coach.com' }
      req.params.id = '123'

      Coach.findById = vi.fn().mockResolvedValue(mockCoach)

      await getCoachById(req, res, next)

      expect(Coach.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCoach
      })
    })

    it('should return 404 if coach not found', async () => {
      req.params.id = '999'
      Coach.findById = vi.fn().mockResolvedValue(null)

      await getCoachById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Coach not found'
      })
    })

    it('should call next with error if findById fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Coach.findById = vi.fn().mockRejectedValue(error)

      await getCoachById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createCoach', () => {
    it('should create a coach successfully', async () => {
      const coachData = {
        firstName: 'New',
        lastName: 'Coach',
        email: 'new@coach.com',
        specialization: 'Football'
      }
      const savedCoach = { _id: '456', ...coachData }

      req.body = coachData

      const mockCoach = {
        ...coachData,
        save: vi.fn().mockResolvedValue()
      }

      mockCoach.save.mockImplementation(async function () {
        Object.assign(this, savedCoach)
      })

      Coach.mockImplementation(function () {
        return mockCoach
      })

      await createCoach(req, res, next)

      expect(mockCoach.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Coach created successfully',
        data: mockCoach
      })
    })

    it('should return 400 if required fields are missing', async () => {
      req.body = { firstName: 'Coach' }

      await createCoach(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Missing required fields: firstName, lastName, email'
      })
    })

    it('should call next with error if save fails', async () => {
      const error = new Error('Database error')
      req.body = {
        firstName: 'Test',
        lastName: 'Coach',
        email: 'test@coach.com'
      }

      const mockSave = vi.fn().mockRejectedValue(error)
      const mockCoach = { ...req.body, save: mockSave }

      Coach.mockImplementation(function () {
        return mockCoach
      })

      await createCoach(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateCoach', () => {
    it('should update a coach successfully', async () => {
      const updatedCoach = {
        _id: '123',
        firstName: 'Updated',
        lastName: 'Coach',
        email: 'updated@coach.com'
      }
      req.params.id = '123'
      req.body = {
        firstName: 'Updated',
        lastName: 'Coach',
        email: 'updated@coach.com'
      }

      Coach.findByIdAndUpdate = vi.fn().mockResolvedValue(updatedCoach)

      await updateCoach(req, res, next)

      expect(Coach.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        {
          firstName: 'Updated',
          lastName: 'Coach',
          email: 'updated@coach.com',
          specialization: undefined,
          experience: undefined,
          isActive: undefined
        },
        { new: true, runValidators: true }
      )
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Coach updated successfully',
        data: updatedCoach
      })
    })

    it('should return 404 if coach not found', async () => {
      req.params.id = '999'
      req.body = { firstName: 'Updated Coach' }
      Coach.findByIdAndUpdate = vi.fn().mockResolvedValue(null)

      await updateCoach(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Coach not found'
      })
    })

    it('should call next with error if update fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      req.body = { firstName: 'Updated Coach' }
      Coach.findByIdAndUpdate = vi.fn().mockRejectedValue(error)

      await updateCoach(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteCoach', () => {
    it('should delete a coach successfully', async () => {
      const deletedCoach = { _id: '123', firstName: 'Deleted', lastName: 'Coach' }
      req.params.id = '123'

      Coach.findByIdAndDelete = vi.fn().mockResolvedValue(deletedCoach)

      await deleteCoach(req, res, next)

      expect(Coach.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Coach deleted successfully',
        data: deletedCoach
      })
    })

    it('should return 404 if coach not found', async () => {
      req.params.id = '999'
      Coach.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteCoach(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Coach not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Coach.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteCoach(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
