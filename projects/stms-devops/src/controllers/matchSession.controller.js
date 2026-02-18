import MatchSession from '../models/MatchSession.js'
import Team from '../models/Team.js'
import Facility from '../models/Facility.js'
import Coach from '../models/Coach.js'

export async function listMatches (req, res, next) {
  try {
    const sessions = await MatchSession.find()
      .populate('teamId')
      .populate('facilityId')
      .populate('coachId')
      .sort({ eventDate: -1 })

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    })
  } catch (error) {
    next(error)
  }
}

export async function getMatchById (req, res, next) {
  try {
    const session = await MatchSession.findById(req.params.id)
      .populate('teamId')
      .populate('facilityId')
      .populate('coachId')

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Match session not found'
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

export async function createMatch (req, res, next) {
  try {
    const { eventDate, eventSlot, eventType, teamId, facilityId, coachId } = req.body

    if (!eventDate || !eventSlot || !teamId || !facilityId || !coachId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Verify team exists
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Team with ID ${teamId} not found`
      })
    }

    // Verify facility exists
    const facility = await Facility.findById(facilityId)
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: `Facility with ID ${facilityId} not found`
      })
    }

    // Verify coach exists
    const coach = await Coach.findById(coachId)
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: `Coach with ID ${coachId} not found`
      })
    }

    // Create match session
    const match = new MatchSession({
      eventDate,
      eventSlot,
      eventType: eventType || 'match',
      teamId,
      facilityId,
      coachId
    })

    await match.save()
    await match.populate('teamId facilityId coachId')

    res.status(201).json({
      success: true,
      message: 'Match session created successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
}

export async function updateMatch (req, res, next) {
  try {
    const { eventDate, eventSlot, eventType } = req.body

    const match = await MatchSession.findByIdAndUpdate(
      req.params.id,
      { eventDate, eventSlot, eventType },
      { new: true, runValidators: true }
    )
      .populate('teamId')
      .populate('facilityId')
      .populate('coachId')

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match session not found'
      })
    }

    res.json({
      success: true,
      message: 'Match session updated successfully',
      data: match
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteMatch (req, res, next) {
  try {
    const session = await MatchSession.findByIdAndDelete(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Match session not found'
      })
    }

    res.json({
      success: true,
      message: 'Match session deleted successfully',
      data: session
    })
  } catch (error) {
    next(error)
  }
}
