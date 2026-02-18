import { describe, it, expect, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { authenticate } from '../../src/middlewares/auth.middleware.js'

process.env.JWT_SECRET = 'test_secret'

describe('authenticate middleware', () => {
  it('attaches req.user when token is valid', () => {
    // Arrange
    const token = jwt.sign(
      { userId: '123', role: 'coach' },
      'test_secret'
    )

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    const next = vi.fn()

    // Act
    authenticate(req, res, next)

    // Assert
    expect(req.user).toEqual({
      id: '123',
      role: 'coach'
    })
    expect(next).toHaveBeenCalled()
  })

  it('returns 401 if token is missing', () => {
    const req = { headers: {} }

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    const next = vi.fn()

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })
})
