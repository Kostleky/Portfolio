// test/unit/role.middleware.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { requireRole } from '../../src/middlewares/role.middleware.js'

describe('role.middleware', () => {
  let req, res, next

  beforeEach(() => {
    // Mock de la requête
    req = { user: null }

    // Mock de la réponse
    res = {
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.body = data
        return this
      }
    }

    // Mock de next()
    next = () => {}
  })

  it('should return 401 if user is not authenticated', () => {
    const middleware = requireRole('admin')

    middleware(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({
      error: true,
      message: 'Authentication required'
    })
  })

  it('should return 403 if user does not have required role', () => {
    req.user = { role: 'player' }
    const middleware = requireRole('admin')

    middleware(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({
      error: true,
      message: 'Forbidden: insufficient permissions'
    })
  })

  it('should call next() if user has required role', () => {
    req.user = { role: 'admin' }
    let nextCalled = false
    next = () => { nextCalled = true }

    const middleware = requireRole('admin')

    middleware(req, res, next)

    expect(nextCalled).toBe(true)
  })

  it('should work with coach role', () => {
    req.user = { role: 'coach' }
    let nextCalled = false
    next = () => { nextCalled = true }

    const middleware = requireRole('coach')

    middleware(req, res, next)

    expect(nextCalled).toBe(true)
  })

  it('should work with player role', () => {
    req.user = { role: 'player' }
    let nextCalled = false
    next = () => { nextCalled = true }

    const middleware = requireRole('player')

    middleware(req, res, next)

    expect(nextCalled).toBe(true)
  })
})
