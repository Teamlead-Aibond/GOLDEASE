const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Payment = require('./models/Payment')
const GoldRate = require('./models/GoldRate')

// ─── Approximate 22K gold rates per gram over the last 12 months ───
// Consistent with existing seeds: Jan 2026 ~₹12,800, today ~₹14,950
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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function monthDate(yearMonth, day, hour, min) {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m - 1, day, hour, min, rand(0, 59))
}

const methods = ['upi', 'card', 'netbanking', 'wallet']

// ─── 3 Customers whose 1-year plan is maturing ───
const redeemCustomers = [
  {
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@gmail.com',
    phone: '9871001001',
    city: 'Coimbatore',
    gender: 'female',
    dob: '1988-06-12',
    password: 'gold1234',
    joinDate: '2025-03',
    // ₹5,000/month plan — invested extra in some months (15 txns)
    transactions: [
      { month: '2025-03', amount: 5000,  day: 5,  hour: 10, min: 15 },
      { month: '2025-03', amount: 2000,  day: 20, hour: 14, min: 30 },
      { month: '2025-04', amount: 5000,  day: 3,  hour: 9,  min: 45 },
      { month: '2025-05', amount: 5000,  day: 7,  hour: 11, min: 20 },
      { month: '2025-05', amount: 3000,  day: 22, hour: 16, min: 10 },
      { month: '2025-06', amount: 5000,  day: 4,  hour: 10, min: 0 },
      { month: '2025-07', amount: 5000,  day: 8,  hour: 13, min: 25 },
      { month: '2025-08', amount: 5000,  day: 2,  hour: 9,  min: 50 },
      { month: '2025-08', amount: 5000,  day: 18, hour: 15, min: 5 },
      { month: '2025-09', amount: 5000,  day: 6,  hour: 10, min: 40 },
      { month: '2025-10', amount: 5000,  day: 3,  hour: 11, min: 15 },
      { month: '2025-11', amount: 5000,  day: 5,  hour: 10, min: 30 },
      { month: '2025-12', amount: 5000,  day: 4,  hour: 9,  min: 20 },
      { month: '2026-01', amount: 5000,  day: 7,  hour: 12, min: 0 },
      { month: '2026-02', amount: 5000,  day: 3,  hour: 10, min: 45 },
    ],
  },
  {
    name: 'Tamilselvi Gopal',
    email: 'tamilselvi.g@gmail.com',
    phone: '9871001002',
    city: 'Chennai',
    gender: 'female',
    dob: '1992-11-25',
    password: 'gold1234',
    joinDate: '2025-03',
    // ₹3,000/month plan — consistent saver (13 txns, skipped 1 month)
    transactions: [
      { month: '2025-03', amount: 3000,  day: 10, hour: 11, min: 0 },
      { month: '2025-04', amount: 3000,  day: 8,  hour: 10, min: 20 },
      { month: '2025-05', amount: 3000,  day: 12, hour: 9,  min: 30 },
      { month: '2025-06', amount: 3000,  day: 6,  hour: 14, min: 15 },
      { month: '2025-07', amount: 3000,  day: 9,  hour: 10, min: 50 },
      { month: '2025-08', amount: 3000,  day: 5,  hour: 11, min: 25 },
      // skipped September
      { month: '2025-10', amount: 3000,  day: 7,  hour: 13, min: 10 },
      { month: '2025-10', amount: 3000,  day: 25, hour: 16, min: 0 },
      { month: '2025-11', amount: 3000,  day: 4,  hour: 10, min: 45 },
      { month: '2025-12', amount: 3000,  day: 9,  hour: 12, min: 30 },
      { month: '2026-01', amount: 3000,  day: 6,  hour: 9,  min: 15 },
      { month: '2026-01', amount: 2000,  day: 20, hour: 15, min: 40 },
      { month: '2026-02', amount: 3000,  day: 5,  hour: 10, min: 20 },
    ],
  },
  {
    name: 'Nagesh Iyer',
    email: 'nagesh.iyer@gmail.com',
    phone: '9871001003',
    city: 'Bangalore',
    gender: 'male',
    dob: '1979-03-08',
    password: 'gold1234',
    joinDate: '2025-04',
    // ₹10,000/month — high-value investor, very regular (12 txns)
    transactions: [
      { month: '2025-04', amount: 10000, day: 1,  hour: 9,  min: 30 },
      { month: '2025-05', amount: 10000, day: 1,  hour: 9,  min: 15 },
      { month: '2025-06', amount: 10000, day: 2,  hour: 10, min: 0 },
      { month: '2025-07', amount: 10000, day: 1,  hour: 9,  min: 45 },
      { month: '2025-08', amount: 10000, day: 1,  hour: 9,  min: 20 },
      { month: '2025-09', amount: 10000, day: 2,  hour: 10, min: 10 },
      { month: '2025-10', amount: 10000, day: 1,  hour: 9,  min: 50 },
      { month: '2025-11', amount: 10000, day: 3,  hour: 11, min: 0 },
      { month: '2025-12', amount: 10000, day: 1,  hour: 9,  min: 30 },
      { month: '2026-01', amount: 10000, day: 2,  hour: 10, min: 15 },
      { month: '2026-02', amount: 10000, day: 1,  hour: 9,  min: 40 },
      { month: '2026-02', amount: 15000, day: 15, hour: 14, min: 30 },
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Remove these 3 customers if they already exist (re-runnable)
  const emails = redeemCustomers.map((c) => c.email)
  const existingUsers = await User.find({ email: { $in: emails } }).lean()
  const existingIds = existingUsers.map((u) => u._id)

  if (existingIds.length > 0) {
    await Promise.all([
      Transaction.deleteMany({ userId: { $in: existingIds } }),
      Payment.deleteMany({ userId: { $in: existingIds } }),
      User.deleteMany({ email: { $in: emails } }),
    ])
    console.log(`Cleaned up ${existingIds.length} existing redeem customer(s)`)
  }

  // Seed GoldRate entries for months that don't have one yet
  for (const [ym, rate] of Object.entries(monthlyRates)) {
    const [y, m] = ym.split('-').map(Number)
    const date = new Date(y, m - 1, 15) // mid-month
    await GoldRate.updateOne(
      { date: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) } },
      { $setOnInsert: { date, rate22K: rate } },
      { upsert: true }
    )
  }
  console.log('Ensured monthly gold rates exist')

  let totalTxnCount = 0
  let totalPayCount = 0

  for (const cust of redeemCustomers) {
    // 1. Create user (joined on first transaction date)
    const firstTxMonth = cust.transactions[0].month
    const firstTxDay = cust.transactions[0].day
    const joinedAt = monthDate(firstTxMonth, firstTxDay, 8, 0)

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
      createdAt: joinedAt,
      updatedAt: joinedAt,
    })

    // 2. Create transactions + payments for each month
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

    // Insert transactions
    const insertedTxns = await Transaction.collection.insertMany(txnDocs)
    const txnIds = Object.values(insertedTxns.insertedIds)

    // Link payments to transactions and insert
    const payDocsClean = payDocs.map((p) => {
      const { _txnIndex, ...rest } = p
      return { ...rest, transactionId: txnIds[_txnIndex] }
    })
    await Payment.collection.insertMany(payDocsClean)

    // 3. Update user balance
    totalGrams = Number(totalGrams.toFixed(4))
    await User.updateOne(
      { _id: user._id },
      { $set: { goldBalance: totalGrams, totalInvested } }
    )

    totalTxnCount += txnDocs.length
    totalPayCount += payDocsClean.length

    console.log(`\n${cust.name}`)
    console.log(`  Joined:    ${joinedAt.toLocaleDateString('en-IN')}`)
    console.log(`  Txns:      ${txnDocs.length}`)
    console.log(`  Invested:  ₹${totalInvested.toLocaleString('en-IN')}`)
    console.log(`  Gold:      ${totalGrams.toFixed(4)}g`)
    console.log(`  Password:  ${cust.password}`)
  }

  console.log('\n── Redeem Customers Seed Summary ──')
  console.log(`Customers:    3`)
  console.log(`Transactions: ${totalTxnCount}`)
  console.log(`Payments:     ${totalPayCount}`)
  console.log(`\nAll 3 customers have ~12 months of gold savings.`)
  console.log(`Their plans are maturing — ready for redemption!`)
  console.log(`\nLogin credentials (password for all: gold1234):`)
  redeemCustomers.forEach((c) => console.log(`  ${c.email}`))

  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
