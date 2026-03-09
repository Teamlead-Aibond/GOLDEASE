const express = require('express')
const { body, validationResult } = require('express-validator')
const { fetchGoldPrice, getGoldPrice, setCacheFromExternal } = require('../utils/goldPriceCache')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const Payment = require('../models/Payment')
const Ornament = require('../models/Ornament')
const protect = require('../middleware/auth')

const router = express.Router()

// Generate a unique RDM-XXXXXX redeem code
async function generateRedeemCode() {
  for (let i = 0; i < 10; i++) {
    const digits = String(Math.floor(100000 + Math.random() * 900000))
    const code = `RDM-${digits}`
    const exists = await Ornament.findOne({ redeemCode: code }).lean()
    if (!exists) return code
  }
  throw new Error('Failed to generate unique redeem code')
}

// GET /api/gold/price — Get live gold price
router.get('/price', async (req, res) => {
  try {
    const goldData = await fetchGoldPrice()

    // Keep shared cache in sync
    setCacheFromExternal(goldData)

    res.json(goldData)
  } catch (error) {
    console.error('Gold API Error:', error.response?.data || error.message)

    const cached = getGoldPrice()
    if (cached) {
      return res.json({ ...cached, cached: true, warning: 'Using cached data due to API error' })
    }

    res.status(500).json({
      error: 'Failed to fetch gold price',
      message: error.response?.data?.error || error.message,
    })
  }
})

// POST /api/gold/buy — Buy gold (protected)
router.post('/buy', protect, [
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be positive'),
  body('grams').optional().isFloat({ gt: 0 }).withMessage('Grams must be positive'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    const { amount, grams, karat, paymentMethod } = req.body
    if (!amount && !grams) {
      return res.status(400).json({ error: 'Provide either amount (rupees) or grams' })
    }

    const selectedKarat = karat === '22K' ? '22K' : '24K'
    const method = ['upi', 'card', 'netbanking', 'wallet'].includes(paymentMethod)
      ? paymentMethod : 'upi'

    // Get current gold price
    let goldPrice = getGoldPrice()
    if (!goldPrice) {
      try {
        goldPrice = await fetchGoldPrice()
      } catch {
        return res.status(503).json({ error: 'Gold price unavailable, try again later' })
      }
    }

    const pricePerGram = selectedKarat === '22K' ? goldPrice.price22K : goldPrice.price24K
    let buyGrams, buyAmount

    if (amount) {
      buyAmount = Number(amount)
      buyGrams = Number((buyAmount / pricePerGram).toFixed(4))
    } else {
      buyGrams = Number(Number(grams).toFixed(4))
      buyAmount = Math.round(buyGrams * pricePerGram)
    }

    // Update user balance
    const user = await User.findById(req.user._id)
    user.goldBalance = Number((user.goldBalance + buyGrams).toFixed(4))
    user.totalInvested += buyAmount
    await user.save()

    // Create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'buy',
      grams: buyGrams,
      amount: buyAmount,
      pricePerGram,
      status: 'completed',
      description: `Bought ${buyGrams}g ${selectedKarat} gold at ₹${pricePerGram}/g`,
    })

    // Create payment record (needed for admin dashboard analytics)
    await Payment.create({
      userId: user._id,
      transactionId: transaction._id,
      amount: buyAmount,
      method,
      status: 'success',
      referenceId: `BUY-${transaction._id}`,
    })

    res.status(201).json({
      message: `Successfully bought ${buyGrams}g of ${selectedKarat} gold`,
      transaction: {
        id: transaction._id,
        grams: buyGrams,
        amount: buyAmount,
        pricePerGram,
        karat: selectedKarat,
      },
      balance: {
        goldBalance: user.goldBalance,
        totalInvested: user.totalInvested,
      },
    })
  } catch (error) {
    console.error('Buy error:', error.message)
    res.status(500).json({ error: 'Failed to process purchase' })
  }
})

// POST /api/gold/redeem — Redeem entire gold balance for jewellery (protected)
router.post('/redeem', protect, [
  body('ornamentName').notEmpty().withMessage('Ornament name is required'),
  body('makingCharges').isFloat({ min: 0 }).withMessage('Making charges must be non-negative'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    const { ornamentName, makingCharges, category } = req.body

    const user = await User.findById(req.user._id)

    // Check if user has already redeemed
    if (user.hasRedeemed) {
      return res.status(400).json({ error: 'You have already redeemed your gold. Please join the scheme again to start a new plan.' })
    }

    // Redeem entire gold balance
    const grams = user.goldBalance
    if (grams <= 0) {
      return res.status(400).json({ error: 'No gold balance to redeem.' })
    }

    // Get current gold price for valuation
    let goldPrice = getGoldPrice()
    if (!goldPrice) {
      try {
        goldPrice = await fetchGoldPrice()
      } catch {
        return res.status(503).json({ error: 'Gold price unavailable, try again later' })
      }
    }

    const pricePerGram = goldPrice.price22K
    const goldValue = Math.round(grams * pricePerGram)

    // Set gold balance to 0 and mark as redeemed
    user.goldBalance = 0
    user.hasRedeemed = true
    await user.save()

    // Create redeem transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'redeem',
      grams,
      amount: goldValue,
      pricePerGram,
      status: 'completed',
      description: `Redeemed ${grams}g gold for ${ornamentName}`,
    })

    // Generate unique redeem code
    const redeemCode = await generateRedeemCode()

    // Create ornament order
    await Ornament.create({
      userId: user._id,
      ornamentName,
      category: category || 'other',
      goldWeightGrams: grams,
      pricePerGram,
      makingCharges: Number(makingCharges),
      totalPrice: goldValue + Number(makingCharges),
      status: 'ordered',
      redeemCode,
      redeemStatus: 'pending',
    })

    res.status(201).json({
      message: `Successfully redeemed ${grams}g gold for ${ornamentName}`,
      transaction: {
        id: transaction._id,
        grams,
        amount: goldValue,
        pricePerGram,
        ornamentName,
        redeemCode,
      },
      balance: {
        goldBalance: 0,
      },
    })
  } catch (error) {
    console.error('Redeem error:', error.message)
    res.status(500).json({ error: 'Failed to process redemption' })
  }
})

module.exports = router
