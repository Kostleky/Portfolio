import express from 'express'
import {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../../controllers/team.controller.js'

const router = express.Router()

router.get('/', listTeams)
router.get('/:id', getTeamById)
router.post('/', createTeam)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)

export default router
