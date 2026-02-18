import TrainingSession from '../models/TrainingSession.js'
import Facility from '../models/Facility.js'
import Coach from '../models/Coach.js'
import Team from '../models/Team.js'

export async function listTrainingSessions (req, res, next) {
  try {
    const trainings = await TrainingSession.find()
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')
      .sort({ eventDate: 1 })

    res.json({
      success: true,
      count: trainings.length,
      data: trainings
    })
  } catch (error) {
    next(error)
  }
}

export async function getTrainingSessionById (req, res, next) {
  try {
    const session = await TrainingSession.findById(req.params.id)
      .populate('coachId')
      .populate('facilityId')
      .populate('teamId')

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Training session not found'
      })
    }

    res.json({
      success: true,
      data: session
    })
  } catch (error) {
    next(error)
  }
}

export async function createTrainingSession (req, res, next) {
  try {
    const {
      eventDate,
      eventSlot,
      duration,
      trainingLevel = 'intermediate',
      trainingType = 'mixed',
      facilityId,
      coachId,
      teamId,
      maxParticipants = 25,
      description,
      isMandatory = false
    } = req.body

    // Basic validation (we verify that the date, slot, duration, facilityID, coachID and teamID exist)
    if (!eventDate || !eventSlot || !duration || !facilityId || !coachId || !teamId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // We verify that the facility itself exists
    const facility = await Facility.findById(facilityId)
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: `Facility with ID ${facilityId} not found`
      })
    }

    // We verify that the coach exists
    const coach = await Coach.findById(coachId)
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: `Coach with ID ${coachId} not found`
      })
    }

    // We verify that the team exists
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Team with ID ${teamId} not found`
      })
    }

    // We create the new training
    const training = new TrainingSession({
      eventDate,
      eventSlot,
      duration,
      trainingLevel,
      trainingType,
      facilityId,
      coachId,
      teamId,
      maxParticipants,
      description,
      isMandatory,
      eventType: 'training'
    })

    // We save in MongoDB
    await training.save()

    // We fill in the references
    await training.populate('facilityId coachId teamId')

    res.status(201).json({
      success: true,
      message: 'Training session created successfully',
      data: training
    })
  } catch (error) {
    next(error)
  }
}

export async function updateTrainingSession (req, res, next) {
  try {
    const {
      eventDate,
      eventSlot,
      duration,
      trainingLevel,
      trainingType,
      maxParticipants,
      description,
      isMandatory
    } = req.body

    const training = await TrainingSession.findByIdAndUpdate(
      req.params.id,
      {
        eventDate,
        eventSlot,
        duration,
        trainingLevel,
        trainingType,
        maxParticipants,
        description,
        isMandatory
      },
      { new: true, runValidators: true }
    )
      .populate('facilityId')
      .populate('coachId')
      .populate('teamId')

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training session not found'
      })
    }

    res.json({
      success: true,
      message: 'Training session updated successfully',
      data: training
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTrainingSession (req, res, next) {
  try {
    const training = await TrainingSession.findByIdAndDelete(req.params.id)

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training session not found'
      })
    }

    res.json({
      success: true,
      message: 'Training session deleted successfully',
      data: training
    })
  } catch (error) {
    next(error)
  }
}
