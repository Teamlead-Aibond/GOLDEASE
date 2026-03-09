const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Payment = require('./models/Payment')
const Ornament = require('./models/Ornament')
const GoldRate = require('./models/GoldRate')

// ─── Today's gold rate (22K per gram) ───
const GOLD_RATE_22K = 14950

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function todayDate(hour, minute) {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, rand(0, 59))
}

const methods = ['upi', 'card', 'netbanking', 'wallet']

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Get existing users to attach transactions to
  const users = await User.find({ role: 'user' }).limit(50).lean()
  if (users.length === 0) {
    console.error('No users found! Run seedDataFeb.js first.')
    process.exit(1)
  }
  console.log(`Found ${users.length} existing users`)

  // Remove only today's seeded data (not historical)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  const todayFilter = { createdAt: { $gte: todayStart, $lt: todayEnd } }

  await Promise.all([
    Transaction.deleteMany(todayFilter),
    Payment.deleteMany(todayFilter),
    Ornament.deleteMany(todayFilter),
    GoldRate.deleteMany({ date: { $gte: todayStart, $lt: todayEnd } }),
  ])
  console.log('Cleared today\'s existing data')

  // 1. Seed today's Gold Rate
  await GoldRate.create({ date: todayStart, rate22K: GOLD_RATE_22K })
  console.log(`Seeded gold rate: ₹${GOLD_RATE_22K}/g (22K)`)

  // 2. Buy Transactions — 8 purchases from different customers
  const buyTxns = [
    { userIdx: 0,  amount: 12000, hour: 9,  min: 15 },
    { userIdx: 3,  amount: 8000,  hour: 9,  min: 42 },
    { userIdx: 7,  amount: 15000, hour: 10, min: 10 },
    { userIdx: 12, amount: 5000,  hour: 10, min: 35 },
    { userIdx: 18, amount: 20000, hour: 11, min: 20 },
    { userIdx: 22, amount: 9000,  hour: 12, min: 5 },
    { userIdx: 30, amount: 11000, hour: 13, min: 30 },
    { userIdx: 35, amount: 7000,  hour: 14, min: 15 },
  ]

  const txnDocs = []
  const payDocs = []
  const userBalanceUpdates = {}

  for (const tx of buyTxns) {
    const user = users[tx.userIdx]
    if (!user) continue
    const pricePerGram = GOLD_RATE_22K
    const grams = Number((tx.amount / pricePerGram).toFixed(4))
    const createdAt = todayDate(tx.hour, tx.min)

    txnDocs.push({
      userId: user._id,
      type: 'buy',
      grams,
      amount: tx.amount,
      pricePerGram,
      status: 'completed',
      description: `Bought ${grams}g gold at ₹${pricePerGram}/g`,
      createdAt,
      updatedAt: createdAt,
    })

    payDocs.push({
      userId: user._id,
      amount: tx.amount,
      method: pick(methods),
      status: 'success',
      referenceId: `PAY${Date.now()}${rand(1000, 9999)}`,
      createdAt,
      updatedAt: createdAt,
      _txnIndex: txnDocs.length - 1,
    })

    const key = user._id.toString()
    if (!userBalanceUpdates[key]) userBalanceUpdates[key] = { goldDelta: 0, investDelta: 0 }
    userBalanceUpdates[key].goldDelta += grams
    userBalanceUpdates[key].investDelta += tx.amount
  }

  const insertedTxns = await Transaction.collection.insertMany(txnDocs)
  const txnIds = Object.values(insertedTxns.insertedIds)

  const payDocsClean = payDocs.map((p) => {
    const { _txnIndex, ...rest } = p
    return { ...rest, transactionId: txnIds[_txnIndex] }
  })
  await Payment.collection.insertMany(payDocsClean)
  console.log(`Seeded ${txnDocs.length} buy transactions + ${payDocsClean.length} payments`)

  // 3. Redeem Transactions — 2 redemptions
  const redeemTxns = [
    { userIdx: 0,  grams: 0.40, hour: 11, min: 45 },
    { userIdx: 12, grams: 0.35, hour: 13, min: 10 },
  ]

  const redeemDocs = []
  for (const rx of redeemTxns) {
    const user = users[rx.userIdx]
    if (!user) continue
    const pricePerGram = GOLD_RATE_22K
    const amount = Math.round(rx.grams * pricePerGram)
    const createdAt = todayDate(rx.hour, rx.min)

    redeemDocs.push({
      userId: user._id,
      type: 'redeem',
      grams: rx.grams,
      amount,
      pricePerGram,
      status: 'completed',
      description: `Redeemed ${rx.grams}g gold at ₹${pricePerGram}/g`,
      createdAt,
      updatedAt: createdAt,
    })

    const key = user._id.toString()
    if (!userBalanceUpdates[key]) userBalanceUpdates[key] = { goldDelta: 0, investDelta: 0 }
    userBalanceUpdates[key].goldDelta -= rx.grams
  }
  await Transaction.collection.insertMany(redeemDocs)
  console.log(`Seeded ${redeemDocs.length} redeem transactions`)

  // 4. Ornament Orders — 1 order
  const ornamentOrders = [
    { userIdx: 18, name: 'Gold Coin 1g', category: 'coin', weight: 1.0, making: 200, status: 'ordered', hour: 12, min: 30 },
  ]

  const ornDocs = ornamentOrders.map((o) => {
    const user = users[o.userIdx]
    const createdAt = todayDate(o.hour, o.min)
    const totalPrice = Math.round(o.weight * GOLD_RATE_22K + o.making)

    const key = user._id.toString()
    if (!userBalanceUpdates[key]) userBalanceUpdates[key] = { goldDelta: 0, investDelta: 0 }
    userBalanceUpdates[key].goldDelta -= o.weight

    return {
      userId: user._id,
      ornamentName: o.name,
      category: o.category,
      goldWeightGrams: o.weight,
      pricePerGram: GOLD_RATE_22K,
      makingCharges: o.making,
      totalPrice,
      status: o.status,
      createdAt,
      updatedAt: createdAt,
    }
  })
  await Ornament.collection.insertMany(ornDocs)
  console.log(`Seeded ${ornDocs.length} ornament orders`)

  // 5. Update user balances (incremental, not overwrite)
  const bulkOps = Object.entries(userBalanceUpdates).map(([id, delta]) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(id) },
      update: {
        $inc: {
          goldBalance: Number(delta.goldDelta.toFixed(4)),
          totalInvested: delta.investDelta,
        },
      },
    },
  }))
  await User.bulkWrite(bulkOps)
  console.log(`Updated ${bulkOps.length} user balances`)

  // 6. Summary
  const totalBuyAmt = buyTxns.reduce((s, t) => s + t.amount, 0)
  const totalRedeemGrams = redeemTxns.reduce((s, t) => s + t.grams, 0)
  const totalRedeemAmt = redeemDocs.reduce((s, d) => s + d.amount, 0)

  console.log('\n── Today\'s Seed Summary ──')
  console.log(`Buy:      ${buyTxns.length} transactions / ₹${totalBuyAmt.toLocaleString('en-IN')}`)
  console.log(`Redeem:   ${redeemTxns.length} transactions / ${totalRedeemGrams.toFixed(2)}g / ₹${totalRedeemAmt.toLocaleString('en-IN')}`)
  console.log(`Ornaments: ${ornDocs.length} orders`)
  console.log(`Gold Rate: ₹${GOLD_RATE_22K}/g (22K)`)
  console.log('\nDone! Refresh your admin dashboard with "Today" filter.')

  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
