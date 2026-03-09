const express = require('express')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const protect = require('../middleware/auth')

const router = express.Router()

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    const { name, email, phone, password, dob, gender, address, city, pincode, pan, aadhaar } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const user = await User.create({
      name, email, phone, password,
      dob: dob || '',
      gender: gender || '',
      address: address || '',
      city: city || '',
      pincode: pincode || '',
      pan: pan || '',
      aadhaar: aadhaar || '',
    })

    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        goldBalance: user.goldBalance,
        walletBalance: user.walletBalance,
        totalInvested: user.totalInvested,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/login
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

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        goldBalance: user.goldBalance,
        walletBalance: user.walletBalance,
        totalInvested: user.totalInvested,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/auth/me — Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    goldBalance: req.user.goldBalance,
    walletBalance: req.user.walletBalance,
    totalInvested: req.user.totalInvested,
    dob: req.user.dob,
    gender: req.user.gender,
    city: req.user.city,
  })
})

// GET /api/auth/portfolio — Portfolio summary
router.get('/portfolio', protect, async (req, res) => {
  try {
    const user = req.user

    // Get latest gold price for current value calculation
    const { getGoldPrice } = require('../utils/goldPriceCache')
    const goldPrice = getGoldPrice()
    const pricePerGram = goldPrice ? goldPrice.price24K : 6000 // fallback

    const currentValue = user.goldBalance * pricePerGram
    const returns = currentValue - user.totalInvested
    const returnPercent = user.totalInvested > 0
      ? ((returns / user.totalInvested) * 100).toFixed(2)
      : 0

    const response = {
      goldBalance: user.goldBalance,
      totalInvested: user.totalInvested,
      currentValue: Math.round(currentValue),
      returns: Math.round(returns),
      returnPercent: Number(returnPercent),
      pricePerGram,
      hasRedeemed: user.hasRedeemed || false,
    }

    // Include redeem details when user has redeemed
    if (user.hasRedeemed) {
      const Ornament = require('../models/Ornament')
      const ornament = await Ornament.findOne({ userId: user._id, redeemCode: { $ne: null } })
        .sort({ createdAt: -1 })
      if (ornament) {
        response.redeemCode = ornament.redeemCode
        response.ornamentName = ornament.ornamentName
        response.redeemStatus = ornament.redeemStatus
        response.redeemedAt = ornament.createdAt
      }
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
