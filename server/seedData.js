const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcryptjs')

const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Payment = require('./models/Payment')
const Ornament = require('./models/Ornament')
const GoldRate = require('./models/GoldRate')

// ─── January 2026 Gold Rates (22K per gram) ───
const goldRates = {
  1: 12656.0, 2: 12708.5, 3: 12708.5, 4: 12708.5, 5: 12936.0,
  6: 12967.3, 7: 12845.5, 8: 12781.9, 9: 12971.0, 10: 12971.0,
  11: 12971.0, 12: 12794.5, 13: 12863.0, 14: 12971.0, 15: 12939.5,
  16: 12922.7, 17: 12922.7, 18: 12922.7, 19: 12832.0, 20: 12773.5,
  21: 12780.0, 22: 12767.0, 23: 12767.5, 24: 12767.5, 25: 12767.5,
  26: 12748.0, 27: 12844.0, 28: 12975.0, 29: 13046.0, 30: 13076.5,
  31: 13076.5,
}

function janDate(day) {
  return new Date(2026, 0, day, 10, Math.floor(Math.random() * 50), 0)
}

function rateOnDay(day) {
  return goldRates[day] || goldRates[31]
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ─── 30 Customers ───
const customers = [
  { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '9876543210', city: 'Coimbatore', gender: 'male', dob: '1985-03-15', joinDay: 1 },
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '9876543211', city: 'Chennai', gender: 'female', dob: '1990-07-22', joinDay: 1 },
  { name: 'Arun Venkatesh', email: 'arun.venkat@gmail.com', phone: '9876543212', city: 'Coimbatore', gender: 'male', dob: '1988-11-04', joinDay: 1 },
  { name: 'Deepa Rajan', email: 'deepa.rajan@gmail.com', phone: '9876543213', city: 'Madurai', gender: 'female', dob: '1992-01-18', joinDay: 2 },
  { name: 'Suresh Babu', email: 'suresh.babu@gmail.com', phone: '9876543214', city: 'Salem', gender: 'male', dob: '1980-05-30', joinDay: 2 },
  { name: 'Kavitha Murali', email: 'kavitha.murali@gmail.com', phone: '9876543215', city: 'Trichy', gender: 'female', dob: '1995-09-12', joinDay: 3 },
  { name: 'Murugan S', email: 'murugan.s@gmail.com', phone: '9876543216', city: 'Erode', gender: 'male', dob: '1987-12-25', joinDay: 4 },
  { name: 'Lakshmi Narayanan', email: 'lakshmi.nara@gmail.com', phone: '9876543217', city: 'Chennai', gender: 'female', dob: '1993-04-08', joinDay: 5 },
  { name: 'Karthik Raja', email: 'karthik.raja@gmail.com', phone: '9876543218', city: 'Coimbatore', gender: 'male', dob: '1991-06-14', joinDay: 6 },
  { name: 'Anitha Devi', email: 'anitha.devi@gmail.com', phone: '9876543219', city: 'Tirunelveli', gender: 'female', dob: '1989-02-28', joinDay: 7 },
  { name: 'Venkatesh R', email: 'venkatesh.r@gmail.com', phone: '9876543220', city: 'Bangalore', gender: 'male', dob: '1984-08-19', joinDay: 8 },
  { name: 'Sowmya Krishnan', email: 'sowmya.k@gmail.com', phone: '9876543221', city: 'Coimbatore', gender: 'female', dob: '1996-10-03', joinDay: 9 },
  { name: 'Ganesh Moorthy', email: 'ganesh.m@gmail.com', phone: '9876543222', city: 'Madurai', gender: 'male', dob: '1982-07-11', joinDay: 10 },
  { name: 'Revathi Sundar', email: 'revathi.s@gmail.com', phone: '9876543223', city: 'Salem', gender: 'female', dob: '1994-03-27', joinDay: 11 },
  { name: 'Bala Subramanian', email: 'bala.subra@gmail.com', phone: '9876543224', city: 'Trichy', gender: 'male', dob: '1986-11-15', joinDay: 12 },
  { name: 'Meena Kumari', email: 'meena.kumari@gmail.com', phone: '9876543225', city: 'Coimbatore', gender: 'female', dob: '1991-01-09', joinDay: 13 },
  { name: 'Saravanan P', email: 'saravanan.p@gmail.com', phone: '9876543226', city: 'Chennai', gender: 'male', dob: '1983-09-21', joinDay: 14 },
  { name: 'Divya Lakshmi', email: 'divya.lak@gmail.com', phone: '9876543227', city: 'Erode', gender: 'female', dob: '1997-05-16', joinDay: 15 },
  { name: 'Manikandan V', email: 'mani.v@gmail.com', phone: '9876543228', city: 'Tirunelveli', gender: 'male', dob: '1985-12-02', joinDay: 16 },
  { name: 'Sangeetha M', email: 'sangeetha.m@gmail.com', phone: '9876543229', city: 'Coimbatore', gender: 'female', dob: '1993-08-07', joinDay: 17 },
  { name: 'Prakash Raj', email: 'prakash.raj@gmail.com', phone: '9876543230', city: 'Bangalore', gender: 'male', dob: '1981-04-13', joinDay: 19 },
  { name: 'Nithya Sri', email: 'nithya.sri@gmail.com', phone: '9876543231', city: 'Madurai', gender: 'female', dob: '1998-06-29', joinDay: 20 },
  { name: 'Senthil Kumar', email: 'senthil.k@gmail.com', phone: '9876543232', city: 'Salem', gender: 'male', dob: '1987-10-18', joinDay: 22 },
  { name: 'Padma Priya', email: 'padma.p@gmail.com', phone: '9876543233', city: 'Coimbatore', gender: 'female', dob: '1990-02-14', joinDay: 23 },
  { name: 'Vijay Anand', email: 'vijay.anand@gmail.com', phone: '9876543234', city: 'Chennai', gender: 'male', dob: '1986-07-06', joinDay: 24 },
  { name: 'Gayathri R', email: 'gayathri.r@gmail.com', phone: '9876543235', city: 'Trichy', gender: 'female', dob: '1994-11-22', joinDay: 26 },
  { name: 'Ashok Selvan', email: 'ashok.selvan@gmail.com', phone: '9876543236', city: 'Erode', gender: 'male', dob: '1989-01-30', joinDay: 27 },
  { name: 'Janani K', email: 'janani.k@gmail.com', phone: '9876543237', city: 'Coimbatore', gender: 'female', dob: '1996-03-11', joinDay: 28 },
  { name: 'Ramesh Babu', email: 'ramesh.babu@gmail.com', phone: '9876543238', city: 'Madurai', gender: 'male', dob: '1983-08-25', joinDay: 29 },
  { name: 'Shalini Devi', email: 'shalini.d@gmail.com', phone: '9876543239', city: 'Coimbatore', gender: 'female', dob: '1992-12-05', joinDay: 30 },
]

// ─── Buy transactions (spread across January) ───
const buyTransactions = [
  // Day, customerIndex, type, amount
  { day: 2, ci: 0, type: 'buy', amount: 5000 },
  { day: 2, ci: 1, type: 'buy', amount: 10000 },
  { day: 3, ci: 2, type: 'buy', amount: 3000 },
  { day: 3, ci: 3, type: 'buy', amount: 1000 },
  { day: 4, ci: 4, type: 'buy', amount: 25000 },
  { day: 5, ci: 0, type: 'buy', amount: 2000 },
  { day: 5, ci: 5, type: 'buy', amount: 8000 },
  { day: 6, ci: 6, type: 'buy', amount: 15000 },
  { day: 7, ci: 1, type: 'buy', amount: 1000 },
  { day: 7, ci: 7, type: 'buy', amount: 50000 },
  { day: 8, ci: 8, type: 'buy', amount: 7500 },
  { day: 9, ci: 9, type: 'buy', amount: 12000 },
  { day: 10, ci: 2, type: 'buy', amount: 1000 },
  { day: 10, ci: 10, type: 'buy', amount: 20000 },
  { day: 12, ci: 11, type: 'buy', amount: 5500 },
  { day: 12, ci: 3, type: 'buy', amount: 1000 },
  { day: 13, ci: 12, type: 'buy', amount: 30000 },
  { day: 14, ci: 13, type: 'buy', amount: 6000 },
  { day: 14, ci: 0, type: 'buy', amount: 2000 },
  { day: 15, ci: 14, type: 'buy', amount: 10000 },
  { day: 16, ci: 15, type: 'buy', amount: 4000 },
  { day: 17, ci: 1, type: 'buy', amount: 1000 },
  { day: 17, ci: 16, type: 'buy', amount: 18000 },
  { day: 19, ci: 17, type: 'buy', amount: 7000 },
  { day: 20, ci: 18, type: 'buy', amount: 9000 },
  { day: 20, ci: 4, type: 'buy', amount: 2000 },
  { day: 21, ci: 19, type: 'buy', amount: 35000 },
  { day: 22, ci: 20, type: 'buy', amount: 11000 },
  { day: 23, ci: 21, type: 'buy', amount: 6500 },
  { day: 24, ci: 22, type: 'buy', amount: 15000 },
  { day: 25, ci: 2, type: 'buy', amount: 1000 },
  { day: 26, ci: 23, type: 'buy', amount: 8500 },
  { day: 27, ci: 24, type: 'buy', amount: 22000 },
  { day: 28, ci: 25, type: 'buy', amount: 4500 },
  { day: 28, ci: 3, type: 'buy', amount: 1000 },
  { day: 29, ci: 26, type: 'buy', amount: 12000 },
  { day: 30, ci: 27, type: 'buy', amount: 5000 },
  { day: 30, ci: 28, type: 'buy', amount: 7000 },
  { day: 31, ci: 29, type: 'buy', amount: 3500 },
]

// ─── Redeem transactions ───
const redeemTransactions = [
  { day: 10, ci: 0, grams: 0.25 },
  { day: 15, ci: 1, grams: 0.5 },
  { day: 18, ci: 4, grams: 1.0 },
  { day: 20, ci: 7, grams: 2.0 },
  { day: 22, ci: 6, grams: 0.75 },
  { day: 25, ci: 10, grams: 0.8 },
  { day: 27, ci: 2, grams: 0.3 },
  { day: 29, ci: 12, grams: 1.5 },
]

// ─── Ornament orders ───
const ornamentOrders = [
  { day: 5, ci: 0, name: 'Gold Coin 5g', category: 'coin', weight: 5.0, making: 500, status: 'delivered' },
  { day: 7, ci: 7, name: 'Classic Band Ring', category: 'ring', weight: 4.0, making: 1200, status: 'delivered' },
  { day: 8, ci: 1, name: 'Figaro Chain 18"', category: 'chain', weight: 8.5, making: 2400, status: 'delivered' },
  { day: 10, ci: 4, name: 'Gold Coin 10g', category: 'coin', weight: 10.0, making: 800, status: 'delivered' },
  { day: 12, ci: 10, name: 'Stud Earrings', category: 'earring', weight: 2.0, making: 800, status: 'delivered' },
  { day: 13, ci: 12, name: 'Engagement Ring', category: 'ring', weight: 5.0, making: 3500, status: 'delivered' },
  { day: 15, ci: 6, name: 'Rope Chain 20"', category: 'chain', weight: 12.0, making: 3200, status: 'delivered' },
  { day: 16, ci: 9, name: 'Slim Gold Bangle', category: 'bangle', weight: 6.0, making: 1500, status: 'delivered' },
  { day: 18, ci: 3, name: 'Gold Coin 2g', category: 'coin', weight: 2.0, making: 300, status: 'delivered' },
  { day: 19, ci: 14, name: 'Jhumka Earrings', category: 'earring', weight: 6.5, making: 2200, status: 'delivered' },
  { day: 20, ci: 8, name: 'Temple Necklace', category: 'necklace', weight: 20.0, making: 6500, status: 'processing' },
  { day: 22, ci: 15, name: 'Mangalsutra', category: 'necklace', weight: 10.0, making: 3200, status: 'ordered' },
  { day: 23, ci: 11, name: 'Cocktail Ring', category: 'ring', weight: 7.5, making: 3200, status: 'processing' },
  { day: 24, ci: 16, name: 'Choker Necklace', category: 'necklace', weight: 18.0, making: 5200, status: 'ordered' },
  { day: 25, ci: 5, name: 'Tennis Bracelet', category: 'bracelet', weight: 12.0, making: 3800, status: 'ready' },
  { day: 26, ci: 17, name: 'Om Pendant', category: 'pendant', weight: 3.0, making: 1200, status: 'ordered' },
  { day: 27, ci: 20, name: 'Lakshmi Gold Coin 8g', category: 'coin', weight: 8.0, making: 900, status: 'ordered' },
  { day: 28, ci: 13, name: 'Drop Earrings', category: 'earring', weight: 4.5, making: 1800, status: 'ordered' },
  { day: 29, ci: 21, name: 'Signet Ring', category: 'ring', weight: 6.0, making: 1800, status: 'cancelled' },
  { day: 30, ci: 24, name: 'Cuban Link Chain', category: 'chain', weight: 22.0, making: 5500, status: 'ordered' },
]

const methods = ['upi', 'card', 'netbanking', 'wallet']

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear existing data (except admin users)
  await Promise.all([
    GoldRate.deleteMany({}),
    Transaction.deleteMany({}),
    Payment.deleteMany({}),
    Ornament.deleteMany({}),
    User.deleteMany({ role: 'user' }),
  ])
  console.log('Cleared existing data')

  // 1. Seed Gold Rates
  const ratesDocs = Object.entries(goldRates).map(([day, rate]) => ({
    date: new Date(2026, 0, Number(day)),
    rate22K: rate,
  }))
  await GoldRate.insertMany(ratesDocs)
  console.log(`Seeded ${ratesDocs.length} gold rates`)

  // 2. Seed Users (bypass password hashing for speed)
  const hashedPw = await bcrypt.hash('demo1234', 12)
  const userDocs = customers.map((c) => ({
    name: c.name,
    email: c.email,
    phone: c.phone,
    password: hashedPw,
    role: 'user',
    dob: c.dob,
    gender: c.gender,
    city: c.city,
    address: `${rand(1, 200)}, ${c.city} Main Road`,
    pincode: String(rand(600001, 641999)),
    pan: `ABCPD${rand(1000, 9999)}${String.fromCharCode(65 + rand(0, 25))}`,
    aadhaar: String(rand(100000000000, 999999999999)),
    goldBalance: 0,
    walletBalance: 0,
    totalInvested: 0,
    createdAt: janDate(c.joinDay),
    updatedAt: janDate(c.joinDay),
  }))

  // Use insertMany with rawResult to skip pre-save hooks (password already hashed)
  const insertedUsers = await User.collection.insertMany(userDocs)
  const userIds = Object.values(insertedUsers.insertedIds)
  console.log(`Seeded ${userIds.length} customers`)

  // Track balances per user
  const userBalances = {}
  userIds.forEach((id) => {
    userBalances[id.toString()] = { goldBalance: 0, totalInvested: 0 }
  })

  // 3. Seed Buy Transactions + Payments
  const txnDocs = []
  const payDocs = []

  for (const tx of buyTransactions) {
    const userId = userIds[tx.ci]
    const pricePerGram = rateOnDay(tx.day)
    const grams = Number((tx.amount / pricePerGram).toFixed(4))
    const createdAt = janDate(tx.day)

    const txnDoc = {
      userId,
      type: tx.type,
      grams,
      amount: tx.amount,
      pricePerGram,
      status: 'completed',
      description: `Bought ${grams}g gold at ₹${pricePerGram}/g`,
      createdAt,
      updatedAt: createdAt,
    }
    txnDocs.push(txnDoc)

    // Most payments success, a few pending/failed
    const isSuccess = Math.random() > 0.08
    payDocs.push({
      userId,
      amount: tx.amount,
      method: pick(methods),
      status: isSuccess ? 'success' : (Math.random() > 0.5 ? 'pending' : 'failed'),
      referenceId: `PAY${Date.now()}${rand(1000, 9999)}`,
      createdAt,
      updatedAt: createdAt,
      _txnIndex: txnDocs.length - 1,
    })

    // Update balances (only for successful payments)
    if (isSuccess) {
      const key = userId.toString()
      userBalances[key].goldBalance += grams
      userBalances[key].totalInvested += tx.amount
    }
  }

  // Insert transactions first, then link payments
  const insertedTxns = await Transaction.collection.insertMany(txnDocs)
  const txnIds = Object.values(insertedTxns.insertedIds)

  const payDocsClean = payDocs.map((p) => {
    const { _txnIndex, ...rest } = p
    return { ...rest, transactionId: txnIds[_txnIndex] }
  })
  await Payment.collection.insertMany(payDocsClean)
  console.log(`Seeded ${txnDocs.length} buy transactions + ${payDocsClean.length} payments`)

  // 4. Seed Redeem Transactions
  const redeemDocs = []
  for (const rx of redeemTransactions) {
    const userId = userIds[rx.ci]
    const pricePerGram = rateOnDay(rx.day)
    const amount = Math.round(rx.grams * pricePerGram)
    const createdAt = janDate(rx.day)

    redeemDocs.push({
      userId,
      type: 'redeem',
      grams: rx.grams,
      amount,
      pricePerGram,
      status: 'completed',
      description: `Redeemed ${rx.grams}g gold at ₹${pricePerGram}/g`,
      createdAt,
      updatedAt: createdAt,
    })

    const key = userId.toString()
    userBalances[key].goldBalance -= rx.grams
  }
  await Transaction.collection.insertMany(redeemDocs)
  console.log(`Seeded ${redeemDocs.length} redeem transactions`)

  // 5. Seed Ornament Orders
  const ornDocs = ornamentOrders.map((o) => {
    const pricePerGram = rateOnDay(o.day)
    const createdAt = janDate(o.day)
    return {
      userId: userIds[o.ci],
      ornamentName: o.name,
      category: o.category,
      goldWeightGrams: o.weight,
      pricePerGram,
      makingCharges: o.making,
      totalPrice: Math.round(o.weight * pricePerGram + o.making),
      status: o.status,
      createdAt,
      updatedAt: createdAt,
    }
  })
  await Ornament.collection.insertMany(ornDocs)
  console.log(`Seeded ${ornDocs.length} ornament orders`)

  // 6. Update User Balances
  const bulkOps = Object.entries(userBalances).map(([id, bal]) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(id) },
      update: {
        $set: {
          goldBalance: Number(bal.goldBalance.toFixed(4)),
          totalInvested: bal.totalInvested,
        },
      },
    },
  }))
  await User.bulkWrite(bulkOps)
  console.log('Updated user balances')

  // 7. Summary
  const totalInvested = buyTransactions.reduce((s, t) => s + t.amount, 0)
  const totalRedeemGrams = redeemTransactions.reduce((s, t) => s + t.grams, 0)
  console.log('\n── Seed Summary ──')
  console.log(`Gold Rates:   ${ratesDocs.length} days`)
  console.log(`Customers:    ${userIds.length}`)
  console.log(`Transactions: ${txnDocs.length} buy + ${redeemDocs.length} redeems = ${txnDocs.length + redeemDocs.length}`)
  console.log(`Payments:     ${payDocsClean.length}`)
  console.log(`Ornaments:    ${ornDocs.length}`)
  console.log(`Total Invested: ₹${totalInvested.toLocaleString('en-IN')}`)
  console.log(`Total Redeemed: ${totalRedeemGrams}g`)

  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
