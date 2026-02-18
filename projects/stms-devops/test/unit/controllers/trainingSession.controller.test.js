import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listTrainingSessions,
  getTrainingSessionById,
  deleteTrainingSession
} from '../../../src/controllers/trainingSession.controller.js'
import TrainingSession from '../../../src/models/TrainingSession.js'

vi.mock('../../../src/models/TrainingSession.js')

describe('TrainingSession Controller - Unit Tests', () => {
  let req, res, next

  beforeEach(() => {
    vi.clearAllMocks()
    req = { body: {}, params: {} }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()
  })

  describe('listTrainingSessions', () => {
    it('should return all training sessions with populated fields', async () => {
      const mockSessions = [
        { _id: '1', eventDate: '2026-01-15' },
        { _id: '2', eventDate: '2026-01-20' }
      ]

      TrainingSession.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockSessions)
      })

      await listTrainingSessions(req, res, next)

      expect(TrainingSession.find).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockSessions
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      TrainingSession.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockRejectedValue(error)
      })

      await listTrainingSessions(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getTrainingSessionById', () => {
    it('should return a training session by id', async () => {
      const mockSession = { _id: '123', eventDate: '2026-01-15' }
      req.params.id = '123'

      TrainingSession.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockSession)
          })
        })
      })

      await getTrainingSessionById(req, res, next)

      expect(TrainingSession.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      })
    })

    it('should return 404 if training session not found', async () => {
      req.params.id = '999'

      TrainingSession.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(null)
          })
        })
      })

      await getTrainingSessionById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Training session not found'
      })
    })
  })

  describe('deleteTrainingSession', () => {
    it('should delete a training session successfully', async () => {
      req.params.id = '123'
      const mockSession = { _id: '123', eventDate: '2026-01-15' }

      TrainingSession.findByIdAndDelete = vi.fn().mockResolvedValue(mockSession)

      await deleteTrainingSession(req, res, next)

      expect(TrainingSession.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Training session deleted successfully',
        data: mockSession
      })
    })

    it('should return 404 if training session not found', async () => {
      req.params.id = '999'
      TrainingSession.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteTrainingSession(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Training session not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'

      TrainingSession.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteTrainingSession(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
