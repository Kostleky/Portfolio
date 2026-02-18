export const requireRole = (role) => {
  return (req, res, next) => {
    // Safety check: authenticate middleware must run first
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Authentication required'
      })
    }

    // Check role
    if (req.user.role !== role) {
      return res.status(403).json({
        error: true,
        message: 'Forbidden: insufficient permissions'
      })
    }

    // Role is valid → continue
    next()
  }
}
