import Team from '../models/Team.js'

export async function listTeams (req, res, next) {
  try {
    const teams = await Team.find()
      .populate('coachId')
      .sort({ name: 1 })

    res.json({
      success: true,
      count: teams.length,
      data: teams
    })
  } catch (error) {
    next(error)
  }
}

export async function getTeamById (req, res, next) {
  try {
    const team = await Team.findById(req.params.id)
      .populate('coachId')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.json({
      success: true,
      data: team
    })
  } catch (error) {
    next(error)
  }
}

export async function createTeam (req, res, next) {
  try {
    const {
      name,
      sport = 'Football',
      city,
      foundedYear,
      coachId,
      isActive = true
    } = req.body

    // Basic validation (we check that the name and the sport exist)
    if (!name || !sport) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, sport'
      })
    }

    // Créer la nouvelle équipe
    const team = new Team({
      name,
      sport,
      city,
      foundedYear,
      coachId,
      isActive
    })

    // We save the new team in MongoDB
    await team.save()

    // We fill in the coachID reference
    await team.populate('coachId')

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    })
  } catch (error) {
    next(error)
  }
}

export async function updateTeam (req, res, next) {
  try {
    const {
      name,
      sport,
      city,
      foundedYear,
      coachId,
      isActive
    } = req.body

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name,
        sport,
        city,
        foundedYear,
        coachId,
        isActive
      },
      { new: true, runValidators: true }
    )
      .populate('coachId')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: team
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTeam (req, res, next) {
  try {
    const team = await Team.findByIdAndDelete(req.params.id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.json({
      success: true,
      message: 'Team deleted successfully',
      data: team
    })
  } catch (error) {
    next(error)
  }
}
