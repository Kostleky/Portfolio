import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../../../src/controllers/team.controller.js'
import Team from '../../../src/models/Team.js'

vi.mock('../../../src/models/Team.js')
vi.mock('../../../src/models/Coach.js')

describe('Team Controller - Unit Tests', () => {
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

  describe('listTeams', () => {
    it('should return all teams with populated coachId', async () => {
      const mockTeams = [
        { _id: '1', name: 'Team A', sport: 'Football', coachId: { _id: '101', firstName: 'John' } },
        { _id: '2', name: 'Team B', sport: 'Basketball', coachId: { _id: '102', firstName: 'Jane' } }
      ]

      const sortMock = vi.fn().mockResolvedValue(mockTeams)
      const populateMock = vi.fn().mockReturnValue({ sort: sortMock })
      Team.find = vi.fn().mockReturnValue({ populate: populateMock })

      await listTeams(req, res, next)

      expect(Team.find).toHaveBeenCalled()
      expect(populateMock).toHaveBeenCalledWith('coachId')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockTeams
      })
    })

    it('should call next with error if find fails', async () => {
      const error = new Error('Database error')
      Team.find = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockRejectedValue(error)
        })
      })

      await listTeams(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getTeamById', () => {
    it('should return a team by id with populated coachId', async () => {
      const mockTeam = {
        _id: '123',
        name: 'Test Team',
        sport: 'Football',
        coachId: { _id: '101', firstName: 'John' }
      }
      req.params.id = '123'

      Team.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockTeam)
      })

      await getTeamById(req, res, next)

      expect(Team.findById).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTeam
      })
    })

    it('should return 404 if team not found', async () => {
      req.params.id = '999'
      Team.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(null)
      })

      await getTeamById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Team not found'
      })
    })

    it('should call next with error if findById fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Team.findById = vi.fn().mockReturnValue({
        populate: vi.fn().mockRejectedValue(error)
      })

      await getTeamById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createTeam', () => {
    it('should create a team successfully', async () => {
      const teamData = { name: 'New Team', sport: 'Football', coachId: '789' }
      const savedTeam = { _id: '456', ...teamData }

      req.body = teamData

      // ✅ CORRECTION : populate() doit modifier l'objet en place
      const mockTeam = {
        ...teamData,
        save: vi.fn(async function () {
          // save ajoute l'_id
          this._id = '456'
          return this
        }),
        populate: vi.fn(async function () {
          // populate modifie l'objet en place en Mongoose
          // On copie toutes les propriétés de savedTeam dans this
          Object.keys(savedTeam).forEach(key => {
            this[key] = savedTeam[key]
          })
          return this
        })
      }

      Team.mockImplementation(function () {
        return mockTeam
      })

      await createTeam(req, res, next)

      expect(mockTeam.save).toHaveBeenCalled()
      expect(mockTeam.populate).toHaveBeenCalledWith('coachId')
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Team created successfully',
        data: expect.objectContaining({
          _id: '456',
          name: 'New Team',
          sport: 'Football',
          coachId: '789'
        })
      })
    })

    it('should call next with error if save fails', async () => {
      const error = new Error('Database error')
      req.body = { name: 'Test Team', sport: 'Football' }

      const mockSave = vi.fn().mockRejectedValue(error)
      const mockTeam = { ...req.body, save: mockSave }

      Team.mockImplementation(function () {
        return mockTeam
      })

      await createTeam(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateTeam', () => {
    it('should update a team successfully', async () => {
      const updatedTeam = {
        _id: '123',
        name: 'Updated Team',
        sport: 'Basketball',
        coachId: { _id: '101', firstName: 'John' }
      }
      req.params.id = '123'
      req.body = { name: 'Updated Team', sport: 'Basketball' }

      Team.findByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(updatedTeam)
      })

      await updateTeam(req, res, next)

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Team updated successfully',
        data: updatedTeam
      })
    })

    it('should return 404 if team not found', async () => {
      req.params.id = '999'
      req.body = { name: 'Updated Team' }
      Team.findByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(null)
      })

      await updateTeam(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Team not found'
      })
    })

    it('should call next with error if update fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      req.body = { name: 'Updated Team' }
      Team.findByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockRejectedValue(error)
      })

      await updateTeam(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteTeam', () => {
    it('should delete a team successfully', async () => {
      const deletedTeam = { _id: '123', name: 'Deleted Team' }
      req.params.id = '123'

      Team.findByIdAndDelete = vi.fn().mockResolvedValue(deletedTeam)

      await deleteTeam(req, res, next)

      expect(Team.findByIdAndDelete).toHaveBeenCalledWith('123')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Team deleted successfully',
        data: deletedTeam
      })
    })

    it('should return 404 if team not found', async () => {
      req.params.id = '999'
      Team.findByIdAndDelete = vi.fn().mockResolvedValue(null)

      await deleteTeam(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Team not found'
      })
    })

    it('should call next with error if delete fails', async () => {
      const error = new Error('Database error')
      req.params.id = '123'
      Team.findByIdAndDelete = vi.fn().mockRejectedValue(error)

      await deleteTeam(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
