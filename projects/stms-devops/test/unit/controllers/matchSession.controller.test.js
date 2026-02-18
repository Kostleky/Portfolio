import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listMatches,
  getMatchById,
  deleteMatch
} from '../../../src/controllers/matchSession.controller.js'
import MatchSession from '../../../src/models/MatchSession.js'

vi.mock('../../../src/models/MatchSession.js')

describe('MatchSession Controller - Unit Tests', () => {
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

  describe('listMatches', () => {
    it('should return all match sessions with populated fields', async () => {
      const mockSessions = [
        { _id: '1', eventDate: '2026-01-15' },
        { _id: '2', eventDate: '2026-01-20' }
      ]

      MatchSession.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockSessions)
      })

      await listMatches(req, res, next)

      expect(MatchSession.find).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockSessions
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      MatchSession.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockRejectedValue(error)
      })

      await listMatches(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getMatchById', () => {
    it('should return a match session by id', async () => {
      const mockSession = { _id: '123', eventDate: '2026-01-15' }
      req.params.id = '123'

      // ✅ Simule 3 populate() chaînés qui retournent mockSession à la fin
      const populateChain3 = { populate: vi.fn().mockResolvedValue(mockSession) }
      const populateChain2 = { populate: vi.fn().mockReturnValue(populateChain3) }
      const populateChain1 = { populate: vi.fn().mockReturnValue(populateChain2) }

      MatchSession.findById = vi.fn().mockReturnValue(populateChain1)

      await getMatchById(req, res, next)

      expect(MatchSession.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      })
    })

    it('should return 404 if match session not found', async () => {
      req.params.id = '999'

      // ✅ Simule 3 populate() chaînés qui retournent null à la fin
      const populateChain3 = { populate: vi.fn().mockResolvedValue(null) }
      const populateChain2 = { populate: vi.fn().mockReturnValue(populateChain3) }
      const populateChain1 = { populate: vi.fn().mockReturnValue(populateChain2) }

      MatchSession.findById = vi.fn().mockReturnValue(populateChain1)

      await getMatchById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Match session not found'
      })
    })
  })

  describe('deleteMatch', () => {
    it('should delete a match session successfully', async () => {
      req.params.id = '123'
      const mockSession = { _id: '123', eventDate: '2026-01-15' }

      MatchSession.findByIdAndDelete = vi.fn().mockResolvedValue(mockSession)

      await deleteMatch(req, res, next)

      expect(MatchSession.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Match session deleted successfully',
        data: mockSession
      })
    })

    it('should return 404 if match session not found', async () => {
      req.params.id = '999'
      MatchSession.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteMatch(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Match session not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'

      MatchSession.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteMatch(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
