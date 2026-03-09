const express = require('express')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const verifyAdmin = require('../middleware/adminAuth')
const {
  getDashboardSummary,
  getDashboardExtended,
  getDailyReport,
  getMonthlyReport,
  getCustomers,
  getPayments,
  getOrnaments,
  getOrnamentCategoryStats,
  exportCustomers,
  exportPayments,
  exportDailyReport,
  exportMonthlyReport,
  exportOrnaments,
  lookupRedeemCode,
  confirmRedemption,
  getRedemptionLogs,
  exportRedemptionLogs,
  getCustomerTransactions,
} = require('../controllers/adminDashboard')

const router = express.Router()

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// POST /api/admin/login — Admin login (separate from user login)
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    const { email, password } = req.body

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, not an admin account' })
    }

    // Verify password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Admin login error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/me — Get current admin profile
router.get('/me', verifyAdmin, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  })
})

// ─── Dashboard APIs (all admin-only) ───
router.get('/dashboard-summary', verifyAdmin, getDashboardSummary)
router.get('/dashboard-extended', verifyAdmin, getDashboardExtended)
router.get('/daily-report', verifyAdmin, getDailyReport)
router.get('/monthly-report', verifyAdmin, getMonthlyReport)
router.get('/customers', verifyAdmin, getCustomers)
router.get('/payments', verifyAdmin, getPayments)
router.get('/ornaments', verifyAdmin, getOrnaments)
router.get('/ornaments/category-stats', verifyAdmin, getOrnamentCategoryStats)

// ─── Customer APIs (all admin-only) ───
router.get('/customers/:userId/transactions', verifyAdmin, getCustomerTransactions)

// ─── Redeem Verification APIs (all admin-only) ───
router.get('/redeem-verify', verifyAdmin, lookupRedeemCode)
router.patch('/redeem-verify/:ornamentId/confirm', verifyAdmin, confirmRedemption)
router.get('/redemption-logs', verifyAdmin, getRedemptionLogs)
router.get('/redemption-logs/export', verifyAdmin, exportRedemptionLogs)

// ─── CSV Export APIs (all admin-only) ───
router.get('/customers/export', verifyAdmin, exportCustomers)
router.get('/payments/export', verifyAdmin, exportPayments)
router.get('/ornaments/export', verifyAdmin, exportOrnaments)
router.get('/daily-report/export', verifyAdmin, exportDailyReport)
router.get('/monthly-report/export', verifyAdmin, exportMonthlyReport)

module.exports = router
