import express from 'express'
import {
  listTrainingSessions,
  getTrainingSessionById,
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession
} from '../../controllers/trainingSession.controller.js'

const router = express.Router()

router.get('/', listTrainingSessions)
router.get('/:id', getTrainingSessionById)
router.post('/', createTrainingSession)
router.put('/:id', updateTrainingSession)
router.delete('/:id', deleteTrainingSession)

export default router
