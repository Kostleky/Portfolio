import express from 'express'
import {
  listCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach
} from '../../controllers/coach.controller.js'

const router = express.Router()

router.get('/', listCoaches)
router.get('/:id', getCoachById)
router.post('/', createCoach)
router.put('/:id', updateCoach)
router.delete('/:id', deleteCoach)

export default router
