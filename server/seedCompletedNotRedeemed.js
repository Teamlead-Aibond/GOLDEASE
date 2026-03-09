const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Payment = require('./models/Payment')

// Monthly 22K gold rates (same as seedRedeemCustomers.js)
const monthlyRates = {
  '2025-03': 8600,
  '2025-04': 8900,
  '2025-05': 9200,
  '2025-06': 9500,
  '2025-07': 9900,
  '2025-08': 10300,
  '2025-09': 10700,
  '2025-10': 11100,
  '2025-11': 11600,
  '2025-12': 12200,
  '2026-01': 12850,
  '2026-02': 14200,
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function monthDate(ym, day, hour, min) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, day, hour, min, rand(0, 59))
}

const methods = ['upi', 'card', 'netbanking', 'wallet']

// 2 customers — plan completed (12 months), NOT redeemed yet
const customers = [
  {
    name: 'Vignesh Ravi',
    email: 'vignesh.ravi@gmail.com',
    phone: '9871002001',
    city: 'Coimbatore',
    gender: 'male',
    dob: '1990-04-18',
    password: 'gold1234',
    // ₹5,000/month — 12 months, plan completed Feb 2026
    transactions: [
      { month: '2025-03', amount: 5000,  day: 5,  hour: 10, min: 30 },
      { month: '2025-04', amount: 5000,  day: 3,  hour: 11, min: 15 },
      { month: '2025-05', amount: 5000,  day: 7,  hour: 9,  min: 45 },
      { month: '2025-06', amount: 5000,  day: 4,  hour: 10, min: 20 },
      { month: '2025-07', amount: 5000,  day: 6,  hour: 14, min: 0 },
      { month: '2025-08', amount: 5000,  day: 2,  hour: 11, min: 10 },
      { month: '2025-09', amount: 5000,  day: 5,  hour: 10, min: 50 },
      { month: '2025-10', amount: 5000,  day: 3,  hour: 13, min: 25 },
      { month: '2025-11', amount: 5000,  day: 4,  hour: 9,  min: 40 },
      { month: '2025-12', amount: 5000,  day: 6,  hour: 12, min: 15 },
      { month: '2026-01', amount: 5000,  day: 5,  hour: 10, min: 35 },
      { month: '2026-02', amount: 5000,  day: 3,  hour: 11, min: 0 },
    ],
  },
  {
    name: 'Swetha Kannan',
    email: 'swetha.kannan@gmail.com',
    phone: '9871002002',
    city: 'Chennai',
    gender: 'female',
    dob: '1994-08-22',
    password: 'gold1234',
    // ₹8,000/month — 12 months, plan completed Feb 2026
    transactions: [
      { month: '2025-03', amount: 8000,  day: 8,  hour: 9,  min: 15 },
      { month: '2025-04', amount: 8000,  day: 5,  hour: 10, min: 40 },
      { month: '2025-05', amount: 8000,  day: 10, hour: 11, min: 30 },
      { month: '2025-06', amount: 8000,  day: 6,  hour: 14, min: 20 },
      { month: '2025-07', amount: 8000,  day: 4,  hour: 10, min: 0 },
      { month: '2025-08', amount: 8000,  day: 7,  hour: 9,  min: 50 },
      { month: '2025-09', amount: 8000,  day: 3,  hour: 13, min: 10 },
      { month: '2025-10', amount: 8000,  day: 5,  hour: 11, min: 45 },
      { month: '2025-11', amount: 8000,  day: 6,  hour: 10, min: 30 },
      { month: '2025-12', amount: 8000,  day: 4,  hour: 12, min: 0 },
      { month: '2026-01', amount: 8000,  day: 7,  hour: 9,  min: 25 },
      { month: '2026-02', amount: 8000,  day: 5,  hour: 10, min: 15 },
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clean up if re-running
  const emails = customers.map(c => c.email)
  const existing = await User.find({ email: { $in: emails } }).lean()
  if (existing.length > 0) {
    const ids = existing.map(u => u._id)
    await Promise.all([
      Transaction.deleteMany({ userId: { $in: ids } }),
      Payment.deleteMany({ userId: { $in: ids } }),
      User.deleteMany({ email: { $in: emails } }),
    ])
    console.log(`Cleaned up ${existing.length} existing user(s)`)
  }

  for (const cust of customers) {
    const joinedAt = monthDate(cust.transactions[0].month, cust.transactions[0].day, 8, 0)

    const user = await User.create({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      city: cust.city,
      gender: cust.gender,
      dob: cust.dob,
      password: cust.password,
      role: 'user',
      goldBalance: 0,
      totalInvested: 0,
      walletBalance: 0,
      hasRedeemed: false,
      createdAt: joinedAt,
      updatedAt: joinedAt,
    })

    const txnDocs = []
    const payDocs = []
    let totalGrams = 0
    let totalInvested = 0

    for (const tx of cust.transactions) {
      const rate = monthlyRates[tx.month]
      const grams = Number((tx.amount / rate).toFixed(4))
      const createdAt = monthDate(tx.month, tx.day, tx.hour, tx.min)

      txnDocs.push({
        userId: user._id,
        type: 'buy',
        grams,
        amount: tx.amount,
        pricePerGram: rate,
        status: 'completed',
        description: `Bought ${grams}g 22K gold at ₹${rate}/g`,
        createdAt,
        updatedAt: createdAt,
      })

      payDocs.push({
        userId: user._id,
        amount: tx.amount,
        method: pick(methods),
        status: 'success',
        referenceId: `PLAN-${user._id}-${txnDocs.length}`,
        createdAt,
        updatedAt: createdAt,
        _txnIndex: txnDocs.length - 1,
      })

      totalGrams += grams
      totalInvested += tx.amount
    }

    const insertedTxns = await Transaction.collection.insertMany(txnDocs)
    const txnIds = Object.values(insertedTxns.insertedIds)

    const payDocsClean = payDocs.map(p => {
      const { _txnIndex, ...rest } = p
      return { ...rest, transactionId: txnIds[_txnIndex] }
    })
    await Payment.collection.insertMany(payDocsClean)

    totalGrams = Number(totalGrams.toFixed(4))
    await User.updateOne({ _id: user._id }, { $set: { goldBalance: totalGrams, totalInvested } })

    console.log(`\n${cust.name}`)
    console.log(`  Email:     ${cust.email}`)
    console.log(`  Password:  ${cust.password}`)
    console.log(`  Plan:      12 months COMPLETED`)
    console.log(`  Invested:  ₹${totalInvested.toLocaleString('en-IN')}`)
    console.log(`  Gold:      ${totalGrams.toFixed(4)}g`)
    console.log(`  Redeemed:  NO — ready to redeem`)
  }

  console.log('\nDone! 2 plan-completed customers added (not redeemed yet).')
  process.exit(0)
}

seed().catch(e => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
