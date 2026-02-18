import Coach from '../models/Coach.js'

export async function listCoaches (req, res, next) {
  try {
    const coaches = await Coach.find().sort({ lastName: 1, firstName: 1 })

    res.json({
      success: true,
      count: coaches.length,
      data: coaches
    })
  } catch (error) {
    next(error)
  }
}

export async function getCoachById (req, res, next) {
  try {
    const coach = await Coach.findById(req.params.id)

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      })
    }

    res.json({
      success: true,
      data: coach
    })
  } catch (error) {
    next(error)
  }
}

export async function createCoach (req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      specialization = 'Football',
      experience = 0,
      isActive = true
    } = req.body

    // Basic validation (we check that the first name, the last name and the email exist)
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, email'
      })
    }

    // We create the new coach
    const coach = new Coach({
      firstName,
      lastName,
      email,
      specialization,
      experience,
      isActive
    })

    // We save the new coach in MongoDB
    await coach.save()

    res.status(201).json({
      success: true,
      message: 'Coach created successfully',
      data: coach
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCoach (req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      specialization,
      experience,
      isActive
    } = req.body

    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        specialization,
        experience,
        isActive
      },
      { new: true, runValidators: true }
    )

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      })
    }

    res.json({
      success: true,
      message: 'Coach updated successfully',
      data: coach
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteCoach (req, res, next) {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id)

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      })
    }

    res.json({
      success: true,
      message: 'Coach deleted successfully',
      data: coach
    })
  } catch (error) {
    next(error)
  }
}
