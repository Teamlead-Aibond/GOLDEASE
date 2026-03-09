const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcryptjs')

const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Payment = require('./models/Payment')
const Ornament = require('./models/Ornament')
const GoldRate = require('./models/GoldRate')

// ─── February 2026 Gold Rates (22K per gram) ───
const goldRates = {
  1: 14200, 2: 14230, 3: 14250, 4: 14280, 5: 14310,
  6: 14340, 7: 14370, 8: 14400, 9: 14430, 10: 14460,
  11: 14480, 12: 14500, 13: 14520, 14: 14550, 15: 14580,
  16: 14600, 17: 14630, 18: 14660, 19: 14700, 20: 14730,
  21: 14760, 22: 14780, 23: 14800, 24: 14830, 25: 14860,
  26: 14880, 27: 14900, 28: 14920,
}

function febDate(day) {
  const h = 10 + Math.floor(Math.random() * 8)
  const m = Math.floor(Math.random() * 60)
  return new Date(2026, 1, day, h, m, Math.floor(Math.random() * 60))
}

function rateOnDay(day) {
  return goldRates[day] || goldRates[27]
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ─── 50 Customers ───
// 30 joined in January, 20 joined in February
const customers = [
  // Jan customers (ci 0-29)
  { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '9876543210', city: 'Coimbatore', gender: 'male', dob: '1985-03-15', joinMonth: 0, joinDay: 3 },
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '9876543211', city: 'Chennai', gender: 'female', dob: '1990-07-22', joinMonth: 0, joinDay: 5 },
  { name: 'Arun Venkatesh', email: 'arun.venkat@gmail.com', phone: '9876543212', city: 'Coimbatore', gender: 'male', dob: '1988-11-04', joinMonth: 0, joinDay: 5 },
  { name: 'Deepa Rajan', email: 'deepa.rajan@gmail.com', phone: '9876543213', city: 'Madurai', gender: 'female', dob: '1992-01-18', joinMonth: 0, joinDay: 6 },
  { name: 'Suresh Babu', email: 'suresh.babu@gmail.com', phone: '9876543214', city: 'Salem', gender: 'male', dob: '1980-05-30', joinMonth: 0, joinDay: 7 },
  { name: 'Kavitha Murali', email: 'kavitha.murali@gmail.com', phone: '9876543215', city: 'Trichy', gender: 'female', dob: '1995-09-12', joinMonth: 0, joinDay: 8 },
  { name: 'Murugan S', email: 'murugan.s@gmail.com', phone: '9876543216', city: 'Erode', gender: 'male', dob: '1987-12-25', joinMonth: 0, joinDay: 9 },
  { name: 'Lakshmi Narayanan', email: 'lakshmi.nara@gmail.com', phone: '9876543217', city: 'Chennai', gender: 'female', dob: '1993-04-08', joinMonth: 0, joinDay: 10 },
  { name: 'Karthik Raja', email: 'karthik.raja@gmail.com', phone: '9876543218', city: 'Coimbatore', gender: 'male', dob: '1991-06-14', joinMonth: 0, joinDay: 10 },
  { name: 'Anitha Devi', email: 'anitha.devi@gmail.com', phone: '9876543219', city: 'Tirunelveli', gender: 'female', dob: '1989-02-28', joinMonth: 0, joinDay: 12 },
  { name: 'Venkatesh R', email: 'venkatesh.r@gmail.com', phone: '9876543220', city: 'Bangalore', gender: 'male', dob: '1984-08-19', joinMonth: 0, joinDay: 13 },
  { name: 'Sowmya Krishnan', email: 'sowmya.k@gmail.com', phone: '9876543221', city: 'Coimbatore', gender: 'female', dob: '1996-10-03', joinMonth: 0, joinDay: 14 },
  { name: 'Ganesh Moorthy', email: 'ganesh.m@gmail.com', phone: '9876543222', city: 'Madurai', gender: 'male', dob: '1982-07-11', joinMonth: 0, joinDay: 15 },
  { name: 'Revathi Sundar', email: 'revathi.s@gmail.com', phone: '9876543223', city: 'Salem', gender: 'female', dob: '1994-03-27', joinMonth: 0, joinDay: 16 },
  { name: 'Bala Subramanian', email: 'bala.subra@gmail.com', phone: '9876543224', city: 'Trichy', gender: 'male', dob: '1986-11-15', joinMonth: 0, joinDay: 17 },
  { name: 'Meena Kumari', email: 'meena.kumari@gmail.com', phone: '9876543225', city: 'Coimbatore', gender: 'female', dob: '1991-01-09', joinMonth: 0, joinDay: 18 },
  { name: 'Saravanan P', email: 'saravanan.p@gmail.com', phone: '9876543226', city: 'Chennai', gender: 'male', dob: '1983-09-21', joinMonth: 0, joinDay: 19 },
  { name: 'Divya Lakshmi', email: 'divya.lak@gmail.com', phone: '9876543227', city: 'Erode', gender: 'female', dob: '1997-05-16', joinMonth: 0, joinDay: 20 },
  { name: 'Manikandan V', email: 'mani.v@gmail.com', phone: '9876543228', city: 'Tirunelveli', gender: 'male', dob: '1985-12-02', joinMonth: 0, joinDay: 21 },
  { name: 'Sangeetha M', email: 'sangeetha.m@gmail.com', phone: '9876543229', city: 'Coimbatore', gender: 'female', dob: '1993-08-07', joinMonth: 0, joinDay: 22 },
  { name: 'Prakash Raj', email: 'prakash.raj@gmail.com', phone: '9876543230', city: 'Bangalore', gender: 'male', dob: '1981-04-13', joinMonth: 0, joinDay: 23 },
  { name: 'Nithya Sri', email: 'nithya.sri@gmail.com', phone: '9876543231', city: 'Madurai', gender: 'female', dob: '1998-06-29', joinMonth: 0, joinDay: 24 },
  { name: 'Senthil Kumar', email: 'senthil.k@gmail.com', phone: '9876543232', city: 'Salem', gender: 'male', dob: '1987-10-18', joinMonth: 0, joinDay: 25 },
  { name: 'Padma Priya', email: 'padma.p@gmail.com', phone: '9876543233', city: 'Coimbatore', gender: 'female', dob: '1990-02-14', joinMonth: 0, joinDay: 26 },
  { name: 'Vijay Anand', email: 'vijay.anand@gmail.com', phone: '9876543234', city: 'Chennai', gender: 'male', dob: '1986-07-06', joinMonth: 0, joinDay: 27 },
  { name: 'Gayathri R', email: 'gayathri.r@gmail.com', phone: '9876543235', city: 'Trichy', gender: 'female', dob: '1994-11-22', joinMonth: 0, joinDay: 28 },
  { name: 'Ashok Selvan', email: 'ashok.selvan@gmail.com', phone: '9876543236', city: 'Erode', gender: 'male', dob: '1989-01-30', joinMonth: 0, joinDay: 29 },
  { name: 'Janani K', email: 'janani.k@gmail.com', phone: '9876543237', city: 'Coimbatore', gender: 'female', dob: '1996-03-11', joinMonth: 0, joinDay: 29 },
  { name: 'Ramesh Babu', email: 'ramesh.babu@gmail.com', phone: '9876543238', city: 'Madurai', gender: 'male', dob: '1983-08-25', joinMonth: 0, joinDay: 30 },
  { name: 'Shalini Devi', email: 'shalini.d@gmail.com', phone: '9876543239', city: 'Coimbatore', gender: 'female', dob: '1992-12-05', joinMonth: 0, joinDay: 31 },

  // Feb customers (ci 30-49) — joinDay is always before their first transaction
  { name: 'Aravind Swamy', email: 'aravind.swamy@gmail.com', phone: '9876543240', city: 'Coimbatore', gender: 'male', dob: '1988-05-20', joinMonth: 1, joinDay: 1 },
  { name: 'Bhavani Devi', email: 'bhavani.devi@gmail.com', phone: '9876543241', city: 'Chennai', gender: 'female', dob: '1991-03-14', joinMonth: 1, joinDay: 1 },
  { name: 'Chandran M', email: 'chandran.m@gmail.com', phone: '9876543242', city: 'Madurai', gender: 'male', dob: '1984-09-07', joinMonth: 1, joinDay: 2 },
  { name: 'Dhanalakshmi S', email: 'dhanalakshmi.s@gmail.com', phone: '9876543243', city: 'Salem', gender: 'female', dob: '1993-12-01', joinMonth: 1, joinDay: 3 },
  { name: 'Elango K', email: 'elango.k@gmail.com', phone: '9876543244', city: 'Trichy', gender: 'male', dob: '1986-06-25', joinMonth: 1, joinDay: 4 },
  { name: 'Fathima Banu', email: 'fathima.banu@gmail.com', phone: '9876543245', city: 'Erode', gender: 'female', dob: '1995-08-18', joinMonth: 1, joinDay: 5 },
  { name: 'Gokul Raj', email: 'gokul.raj@gmail.com', phone: '9876543246', city: 'Coimbatore', gender: 'male', dob: '1990-01-30', joinMonth: 1, joinDay: 6 },
  { name: 'Hemalatha P', email: 'hemalatha.p@gmail.com', phone: '9876543247', city: 'Chennai', gender: 'female', dob: '1987-04-12', joinMonth: 1, joinDay: 7 },
  { name: 'Ilayaraja V', email: 'ilayaraja.v@gmail.com', phone: '9876543248', city: 'Bangalore', gender: 'male', dob: '1982-11-22', joinMonth: 1, joinDay: 8 },
  { name: 'Jayalakshmi R', email: 'jayalakshmi.r@gmail.com', phone: '9876543249', city: 'Coimbatore', gender: 'female', dob: '1994-07-05', joinMonth: 1, joinDay: 9 },
  { name: 'Kathiresan N', email: 'kathiresan.n@gmail.com', phone: '9876543250', city: 'Madurai', gender: 'male', dob: '1989-02-16', joinMonth: 1, joinDay: 14 },
  { name: 'Lalitha Kumari', email: 'lalitha.k@gmail.com', phone: '9876543251', city: 'Salem', gender: 'female', dob: '1996-10-28', joinMonth: 1, joinDay: 15 },
  { name: 'Mohan Das', email: 'mohan.das@gmail.com', phone: '9876543252', city: 'Trichy', gender: 'male', dob: '1983-08-09', joinMonth: 1, joinDay: 16 },
  { name: 'Nandhini V', email: 'nandhini.v@gmail.com', phone: '9876543253', city: 'Erode', gender: 'female', dob: '1992-05-23', joinMonth: 1, joinDay: 17 },
  { name: 'Omkaar S', email: 'omkaar.s@gmail.com', phone: '9876543254', city: 'Coimbatore', gender: 'male', dob: '1985-12-14', joinMonth: 1, joinDay: 18 },
  { name: 'Parvathi M', email: 'parvathi.m@gmail.com', phone: '9876543255', city: 'Chennai', gender: 'female', dob: '1997-03-31', joinMonth: 1, joinDay: 22 },
  { name: 'Raghav Kumar', email: 'raghav.kumar@gmail.com', phone: '9876543256', city: 'Bangalore', gender: 'male', dob: '1988-09-17', joinMonth: 1, joinDay: 23 },
  { name: 'Saranya D', email: 'saranya.d@gmail.com', phone: '9876543257', city: 'Madurai', gender: 'female', dob: '1991-06-08', joinMonth: 1, joinDay: 24 },
  { name: 'Tamilselvan R', email: 'tamilselvan.r@gmail.com', phone: '9876543258', city: 'Coimbatore', gender: 'male', dob: '1986-01-19', joinMonth: 1, joinDay: 24 },
  { name: 'Uma Maheswari', email: 'uma.mahes@gmail.com', phone: '9876543259', city: 'Salem', gender: 'female', dob: '1993-11-04', joinMonth: 1, joinDay: 27 },
]

// ─── Buy transactions (Feb only) ───
// 47 active customers × 1-2 txns = 52 transactions (3 customers inactive)
// Each customer mapped by ci index; some buy once, some twice
const buyTransactions = [
  // Feb 1-7
  { day: 1, ci: 0, amount: 10000 },
  { day: 1, ci: 30, amount: 15000 },
  { day: 2, ci: 1, amount: 8000 },
  { day: 2, ci: 31, amount: 12000 },
  { day: 3, ci: 2, amount: 5000 },
  { day: 3, ci: 32, amount: 20000 },
  { day: 4, ci: 3, amount: 7000 },
  { day: 4, ci: 33, amount: 9000 },
  { day: 5, ci: 4, amount: 25000 },
  { day: 5, ci: 34, amount: 6000 },
  { day: 6, ci: 5, amount: 8000 },
  { day: 6, ci: 35, amount: 11000 },
  { day: 7, ci: 6, amount: 15000 },
  { day: 7, ci: 36, amount: 7000 },

  // Feb 8-14
  { day: 8, ci: 7, amount: 10000 },
  { day: 8, ci: 37, amount: 18000 },
  { day: 9, ci: 8, amount: 6000 },
  { day: 9, ci: 38, amount: 12000 },
  { day: 10, ci: 9, amount: 8000 },
  { day: 10, ci: 39, amount: 5000 },
  { day: 11, ci: 10, amount: 20000 },
  { day: 12, ci: 11, amount: 9000 },
  { day: 13, ci: 12, amount: 30000 },
  { day: 14, ci: 13, amount: 8000 },

  // Feb 15-22
  { day: 15, ci: 14, amount: 12000 },
  { day: 15, ci: 40, amount: 7000 },
  { day: 16, ci: 15, amount: 5000 },
  { day: 16, ci: 41, amount: 9000 },
  { day: 17, ci: 16, amount: 18000 },
  { day: 17, ci: 42, amount: 6000 },
  { day: 18, ci: 17, amount: 8000 },
  { day: 18, ci: 43, amount: 11000 },
  { day: 19, ci: 18, amount: 10000 },
  { day: 19, ci: 44, amount: 15000 },
  { day: 20, ci: 19, amount: 7000 },
  { day: 20, ci: 0, amount: 9000 },   // Rajesh 2nd purchase
  { day: 21, ci: 20, amount: 25000 },
  { day: 21, ci: 1, amount: 6000 },   // Priya 2nd purchase
  { day: 22, ci: 21, amount: 8000 },
  { day: 22, ci: 4, amount: 12000 },  // Suresh 2nd purchase

  // Feb 23-26 (week, excl today)
  { day: 23, ci: 22, amount: 10000 },
  { day: 23, ci: 46, amount: 15000 },
  { day: 24, ci: 23, amount: 8000 },
  { day: 24, ci: 47, amount: 12000 },
  { day: 25, ci: 24, amount: 9000 },
  { day: 25, ci: 48, amount: 7000 },
  { day: 26, ci: 25, amount: 20000 },
  { day: 26, ci: 6, amount: 8000 },   // Murugan 2nd purchase
  { day: 26, ci: 45, amount: 11000 },

  // Feb 27 (today)
  { day: 27, ci: 26, amount: 15000 },
  { day: 27, ci: 49, amount: 10000 },
  { day: 27, ci: 10, amount: 12000 }, // Venkatesh 2nd purchase
].map(t => ({ ...t, type: 'buy' }))

// ─── Redeem transactions (Feb only) ───
// ~12 redeems — only customers who bought gold earlier
const redeemTransactions = [
  { day: 5, ci: 0, grams: 0.50 },
  { day: 7, ci: 4, grams: 1.00 },
  { day: 10, ci: 1, grams: 0.40 },
  { day: 12, ci: 6, grams: 0.80 },
  { day: 14, ci: 12, grams: 1.50 },
  { day: 16, ci: 10, grams: 0.75 },
  { day: 18, ci: 5, grams: 0.45 },
  { day: 20, ci: 7, grams: 0.60 },
  { day: 22, ci: 2, grams: 0.30 },
  { day: 24, ci: 13, grams: 0.40 },
  { day: 26, ci: 25, grams: 0.85 },
  { day: 27, ci: 8, grams: 0.35 },
]

// ─── Ornament orders (Feb only) ───
// ~10 orders — weights fit within each customer's gold balance at order time
const ornamentOrders = [
  { day: 3, ci: 32, name: 'Gold Coin 1g', category: 'coin', weight: 1.0, making: 200, status: 'delivered' },
  { day: 6, ci: 4, name: 'Thin Band Ring', category: 'ring', weight: 0.5, making: 500, status: 'delivered' },
  { day: 9, ci: 38, name: 'Stud Earrings', category: 'earring', weight: 0.5, making: 300, status: 'delivered' },
  { day: 12, ci: 11, name: 'Small Om Pendant', category: 'pendant', weight: 0.5, making: 400, status: 'delivered' },
  { day: 15, ci: 14, name: 'Gold Coin 0.5g', category: 'coin', weight: 0.5, making: 150, status: 'processing' },
  { day: 18, ci: 17, name: 'Tiny Lakshmi Pendant', category: 'pendant', weight: 0.4, making: 300, status: 'processing' },
  { day: 21, ci: 20, name: 'Thin Gold Chain 16"', category: 'chain', weight: 1.5, making: 800, status: 'ordered' },
  { day: 23, ci: 22, name: 'Drop Earrings', category: 'earring', weight: 0.5, making: 250, status: 'ordered' },
  { day: 25, ci: 24, name: 'Gold Coin 0.5g', category: 'coin', weight: 0.5, making: 150, status: 'ordered' },
  { day: 27, ci: 49, name: 'Slim Band Ring', category: 'ring', weight: 0.5, making: 500, status: 'ordered' },
]

const methods = ['upi', 'card', 'netbanking', 'wallet']

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear all data (except admin users)
  await Promise.all([
    GoldRate.deleteMany({}),
    Transaction.deleteMany({}),
    Payment.deleteMany({}),
    Ornament.deleteMany({}),
    User.deleteMany({ role: 'user' }),
  ])
  console.log('Cleared existing data')

  // 1. Seed Gold Rates (Feb only)
  const ratesDocs = Object.entries(goldRates).map(([day, rate]) => ({
    date: new Date(2026, 1, Number(day)),
    rate22K: rate,
  }))
  await GoldRate.insertMany(ratesDocs)
  console.log(`Seeded ${ratesDocs.length} gold rates`)

  // 2. Seed Customers
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
    createdAt: new Date(2026, c.joinMonth, c.joinDay, 10, rand(0, 59), 0),
    updatedAt: new Date(2026, c.joinMonth, c.joinDay, 10, rand(0, 59), 0),
  }))

  const insertedUsers = await User.collection.insertMany(userDocs)
  const userIds = Object.values(insertedUsers.insertedIds)
  console.log(`Seeded ${userIds.length} customers (30 Jan + 20 Feb)`)

  // Track balances
  const userBalances = {}
  userIds.forEach((id) => {
    userBalances[id.toString()] = { goldBalance: 0, totalInvested: 0 }
  })

  // 3. Seed Buy Transactions + Payments (Feb only)
  const txnDocs = []
  const payDocs = []

  for (const tx of buyTransactions) {
    const userId = userIds[tx.ci]
    const pricePerGram = rateOnDay(tx.day)
    const grams = Number((tx.amount / pricePerGram).toFixed(4))
    const createdAt = febDate(tx.day)

    txnDocs.push({
      userId, type: 'buy', grams, amount: tx.amount, pricePerGram,
      status: 'completed',
      description: `Bought ${grams}g gold at ₹${pricePerGram}/g`,
      createdAt, updatedAt: createdAt,
    })

    payDocs.push({
      userId, amount: tx.amount, method: pick(methods),
      status: 'success',
      referenceId: `PAY${Date.now()}${rand(1000, 9999)}`,
      createdAt, updatedAt: createdAt,
      _txnIndex: txnDocs.length - 1,
    })

    const key = userId.toString()
    userBalances[key].goldBalance += grams
    userBalances[key].totalInvested += tx.amount
  }

  const insertedTxns = await Transaction.collection.insertMany(txnDocs)
  const txnIds = Object.values(insertedTxns.insertedIds)

  const payDocsClean = payDocs.map((p) => {
    const { _txnIndex, ...rest } = p
    return { ...rest, transactionId: txnIds[_txnIndex] }
  })
  await Payment.collection.insertMany(payDocsClean)
  console.log(`Seeded ${txnDocs.length} buy transactions + ${payDocsClean.length} payments`)

  // 4. Seed Redeem Transactions (Feb only)
  const redeemDocs = []
  for (const rx of redeemTransactions) {
    const userId = userIds[rx.ci]
    const pricePerGram = rateOnDay(rx.day)
    const amount = Math.round(rx.grams * pricePerGram)
    const createdAt = febDate(rx.day)

    redeemDocs.push({
      userId, type: 'redeem', grams: rx.grams, amount, pricePerGram,
      status: 'completed',
      description: `Redeemed ${rx.grams}g gold at ₹${pricePerGram}/g`,
      createdAt, updatedAt: createdAt,
    })

    const key = userId.toString()
    userBalances[key].goldBalance -= rx.grams
  }
  await Transaction.collection.insertMany(redeemDocs)
  console.log(`Seeded ${redeemDocs.length} redeem transactions`)

  // 5. Seed Ornament Orders
  const ornDocs = ornamentOrders.map((o) => {
    const pricePerGram = rateOnDay(o.day)
    const createdAt = febDate(o.day)

    // Deduct ornament gold from customer balance
    const key = userIds[o.ci].toString()
    userBalances[key].goldBalance -= o.weight

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
  const totalBuyAmt = buyTransactions.reduce((s, t) => s + t.amount, 0)
  const totalRedeemGrams = redeemTransactions.reduce((s, t) => s + t.grams, 0)

  const todayBuy = buyTransactions.filter(t => t.day === 27)
  const weekBuy = buyTransactions.filter(t => t.day >= 23)
  const todayRed = redeemTransactions.filter(t => t.day === 27)
  const weekRed = redeemTransactions.filter(t => t.day >= 23)
  const todayOrn = ornamentOrders.filter(o => o.day === 27)
  const weekOrn = ornamentOrders.filter(o => o.day >= 23)

  console.log('\n── Seed Summary ──')
  console.log(`Customers:    ${userIds.length} (30 Jan + 20 Feb)`)
  console.log(`Gold Rates:   ${ratesDocs.length} days (Feb)`)
  console.log(`Transactions: ${buyTransactions.length} buy + ${redeemTransactions.length} redeems = ${buyTransactions.length + redeemTransactions.length}`)
  console.log(`Payments:     ${payDocsClean.length}`)
  console.log(`Ornaments:    ${ornDocs.length}`)
  console.log(`Total Invested: ₹${totalBuyAmt.toLocaleString('en-IN')}`)
  console.log(`Total Redeemed: ${totalRedeemGrams.toFixed(2)}g`)
  console.log('')
  console.log('── Dashboard Preview ──')
  console.log(`Today (27):   ${todayBuy.length} buy / ₹${todayBuy.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')} | ${todayRed.length} redeem / ${todayRed.reduce((s, t) => s + t.grams, 0).toFixed(2)}g | ${todayOrn.length} ornament`)
  console.log(`Week (23-27): ${weekBuy.length} buy / ₹${weekBuy.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')} | ${weekRed.length} redeem / ${weekRed.reduce((s, t) => s + t.grams, 0).toFixed(2)}g | ${weekOrn.length} ornaments`)
  console.log(`Month:        ${buyTransactions.length} buy / ₹${totalBuyAmt.toLocaleString('en-IN')} | ${redeemTransactions.length} redeem / ${totalRedeemGrams.toFixed(2)}g | ${ornDocs.length} ornaments`)
  console.log(`Gold Rate:    ₹${goldRates[27]}/g (Feb 27)`)

  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
