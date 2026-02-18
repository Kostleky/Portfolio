import Facility from '../models/Facility.js'

export async function listFacilities (req, res, next) {
  try {
    const facilities = await Facility.find().sort({ name: 1 })

    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    })
  } catch (error) {
    next(error)
  }
}

export async function getFacilityById (req, res, next) {
  try {
    const facility = await Facility.findById(req.params.id)

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      })
    }

    res.json({
      success: true,
      data: facility
    })
  } catch (error) {
    next(error)
  }
}

export async function createFacility (req, res, next) {
  try {
    const { name, location, capacity, type } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      })
    }

    const facility = new Facility({
      name,
      location,
      capacity,
      type
    })

    await facility.save()

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: facility
    })
  } catch (error) {
    next(error)
  }
}

export async function updateFacility (req, res, next) {
  try {
    const { name, location, capacity, type } = req.body

    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { name, location, capacity, type },
      { new: true, runValidators: true }
    )

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      })
    }

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: facility
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteFacility (req, res, next) {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id)

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      })
    }

    res.json({
      success: true,
      message: 'Facility deleted successfully',
      data: facility
    })
  } catch (error) {
    next(error)
  }
}
