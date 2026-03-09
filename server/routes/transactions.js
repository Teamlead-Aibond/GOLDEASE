const express = require('express')
const Transaction = require('../models/Transaction')
const protect = require('../middleware/auth')

const router = express.Router()

// GET /api/transactions — List user's transactions (paginated, filterable)
router.get('/', protect, async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query
    const filter = { userId: req.user._id }

    if (type && ['buy', 'redeem'].includes(type)) {
      filter.type = type
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(filter),
    ])

    res.json({
      transactions,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

module.exports = router
