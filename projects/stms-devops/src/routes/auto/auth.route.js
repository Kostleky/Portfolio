import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

const router = express.Router()

/**
 * POST /auth/register
 * Body: { firstName, lastName, email, password, role }
 */
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        error: true,
        message: 'First name, last name, email, password and role are required'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'User already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    })

    // Générer un token après la création
    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(201).json({
      token,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Invalid credentials'
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({
        error: true,
        message: 'Invalid credentials'
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(200).json({
      token,
      role: user.role
    })
  } catch (err) {
    next(err)
  }
})

export default router
