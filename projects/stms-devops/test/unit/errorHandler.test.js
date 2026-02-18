/**
 * Unit tests for src/utils/errorHandler.js.
 * We stub a minimal `res` object to capture status and body.
 */
import { describe, it, expect } from 'vitest'
import { errorHandler } from '../../src/utils/errorHandler.js'

function makeRes () {
  return {
    statusCode: 0,
    body: null,
    status (code) { this.statusCode = code; return this },
    json (obj) { this.body = obj; return this }
  }
}

describe('errorHandler', () => {
  it('defaults to 500 with generic message', () => {
    const res = makeRes()
    errorHandler({}, {}, res, () => {})
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ success: false, message: 'Internal Server Error' })
  })

  it('uses provided status and message', () => {
    const res = makeRes()
    errorHandler({ status: 418, message: 'teapot' }, {}, res, () => {})
    expect(res.statusCode).toBe(418)
    expect(res.body).toEqual({ success: false, message: 'teapot' })
  })
})

describe('errorHandler - Mongoose errors', () => {
  it('handles ValidationError', () => {
    const res = makeRes()
    const err = {
      name: 'ValidationError',
      errors: {
        name: { message: 'Name is required' },
        email: { message: 'Invalid email' }
      }
    }
    errorHandler(err, {}, res, () => {})
    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Validation error')
    expect(res.body.details).toEqual(['Name is required', 'Invalid email'])
  })

  it('handles duplicate key error (11000)', () => {
    const res = makeRes()
    const err = {
      code: 11000,
      keyPattern: { email: 1 }
    }
    errorHandler(err, {}, res, () => {})
    expect(res.statusCode).toBe(409)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Duplicate entry')
    expect(res.body.field).toBe('email')
  })

  it('handles CastError (invalid ObjectId)', () => {
    const res = makeRes()
    const err = {
      name: 'CastError',
      kind: 'ObjectId'
    }
    errorHandler(err, {}, res, () => {})
    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Invalid ID format')
  })
})
