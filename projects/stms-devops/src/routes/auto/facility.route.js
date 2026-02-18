import express from 'express'
import {
  listFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} from '../../controllers/facility.controller.js'

const router = express.Router()

router.get('/', listFacilities)
router.get('/:id', getFacilityById)
router.post('/', createFacility)
router.put('/:id', updateFacility)
router.delete('/:id', deleteFacility)

export default router
