import express from 'express'
import {
  listMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../../controllers/matchSession.controller.js'

const router = express.Router()

router.get('/', listMatches)
router.get('/:id', getMatchById)
router.post('/', createMatch)
router.put('/:id', updateMatch)
router.delete('/:id', deleteMatch)

export default router
