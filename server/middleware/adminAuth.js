const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyAdmin = async (req, res, next) => {
  try {
    // 1. Check for token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied, no token provided' })
    }

    // 2. Verify token
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. Find user
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // 4. Check admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please login again' })
    }
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = verifyAdmin
