import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // 1. Check header existence
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: true,
        message: 'Authentication token missing'
      })
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1]

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Attach user info to request
    req.user = {
      id: decoded.userId,
      role: decoded.role
    }

    // 5. Continue request
    next()
  } catch (err) {
    return res.status(401).json({
      error: true,
      message: 'Invalid or expired token'
    })
  }
}
