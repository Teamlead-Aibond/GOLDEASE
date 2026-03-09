const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Ornament = require('./models/Ornament')

// February 2026 gold rates (22K per gram) — matches seedDataFeb.js
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

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 19 customers who redeemed in February
// email → matched from seedDataFeb customers list
const febRedemptions = [
  { email: 'rajesh.kumar@gmail.com',   day: 6,  ornament: 'Gold Ring',     category: 'ring',     making: 800,  status: 'delivered'  },
  { email: 'priya.sharma@gmail.com',   day: 7,  ornament: 'Gold Coin',     category: 'coin',     making: 250,  status: 'delivered'  },
  { email: 'deepa.rajan@gmail.com',    day: 8,  ornament: 'Gold Pendant',  category: 'pendant',  making: 600,  status: 'delivered'  },
  { email: 'suresh.babu@gmail.com',    day: 9,  ornament: 'Gold Earrings', category: 'earring',  making: 700,  status: 'delivered'  },
  { email: 'kavitha.murali@gmail.com', day: 10, ornament: 'Gold Chain',    category: 'chain',    making: 2500, status: 'delivered'  },
  { email: 'lakshmi.nara@gmail.com',   day: 12, ornament: 'Gold Bracelet', category: 'bracelet', making: 1500, status: 'delivered'  },
  { email: 'anitha.devi@gmail.com',    day: 13, ornament: 'Gold Ring',     category: 'ring',     making: 800,  status: 'delivered'  },
  { email: 'sowmya.k@gmail.com',       day: 14, ornament: 'Gold Coin',     category: 'coin',     making: 250,  status: 'delivered'  },
  { email: 'ganesh.m@gmail.com',       day: 15, ornament: 'Gold Pendant',  category: 'pendant',  making: 600,  status: 'delivered'  },
  { email: 'revathi.s@gmail.com',      day: 16, ornament: 'Gold Earrings', category: 'earring',  making: 700,  status: 'processing' },
  { email: 'meena.kumari@gmail.com',   day: 18, ornament: 'Gold Chain',    category: 'chain',    making: 2500, status: 'processing' },
  { email: 'divya.lak@gmail.com',      day: 19, ornament: 'Gold Bracelet', category: 'bracelet', making: 1500, status: 'processing' },
  { email: 'sangeetha.m@gmail.com',    day: 20, ornament: 'Gold Ring',     category: 'ring',     making: 800,  status: 'processing' },
  { email: 'nithya.sri@gmail.com',     day: 21, ornament: 'Gold Coin',     category: 'coin',     making: 250,  status: 'ordered'    },
  { email: 'padma.p@gmail.com',        day: 22, ornament: 'Gold Pendant',  category: 'pendant',  making: 600,  status: 'ordered'    },
  { email: 'gayathri.r@gmail.com',     day: 23, ornament: 'Gold Earrings', category: 'earring',  making: 700,  status: 'ordered'    },
  { email: 'ashok.selvan@gmail.com',   day: 24, ornament: 'Gold Bracelet', category: 'bracelet', making: 1500, status: 'ordered'    },
  { email: 'janani.k@gmail.com',       day: 25, ornament: 'Gold Ring',     category: 'ring',     making: 800,  status: 'ordered'    },
  { email: 'ramesh.babu@gmail.com',    day: 26, ornament: 'Gold Chain',    category: 'chain',    making: 2500, status: 'ordered'    },
  { email: 'saravanan.p@gmail.com',   day: 11, ornament: 'Gold Chain',    category: 'chain',    making: 2500, status: 'delivered'  },
  { email: 'venkatesh.r@gmail.com',   day: 17, ornament: 'Gold Bracelet', category: 'bracelet', making: 1500, status: 'processing' },
  { email: 'murugan.s@gmail.com',     day: 25, ornament: 'Gold Ring',     category: 'ring',     making: 800,  status: 'ordered'    },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  let count = 0

  for (const r of febRedemptions) {
    const user = await User.findOne({ email: r.email })
    if (!user) {
      console.log(`  SKIP: ${r.email} not found`)
      continue
    }

    // Skip if already redeemed
    if (user.hasRedeemed) {
      console.log(`  SKIP: ${user.name} already redeemed`)
      continue
    }

    const grams = user.goldBalance
    if (grams <= 0) {
      console.log(`  SKIP: ${user.name} has no gold balance`)
      continue
    }

    const pricePerGram = goldRates[r.day] || 14700
    const goldValue = Math.round(grams * pricePerGram)
    const createdAt = febDate(r.day)
    const redeemCode = `RDM-${rand(100000, 999999)}`
    const redeemStatus = (r.status === 'delivered') ? 'completed' : 'pending'

    // 1. Create redeem transaction
    await Transaction.create({
      userId: user._id,
      type: 'redeem',
      grams,
      amount: goldValue,
      pricePerGram,
      status: 'completed',
      description: `Redeemed ${grams}g gold for ${r.ornament}`,
      createdAt,
      updatedAt: createdAt,
    })

    // 2. Create ornament order with redeem code
    await Ornament.create({
      userId: user._id,
      ornamentName: r.ornament,
      category: r.category,
      goldWeightGrams: grams,
      pricePerGram,
      makingCharges: r.making,
      totalPrice: goldValue + r.making,
      status: r.status,
      redeemCode,
      redeemStatus,
      createdAt,
      updatedAt: createdAt,
    })

    // 3. Mark user as redeemed, zero out gold balance
    user.goldBalance = 0
    user.hasRedeemed = true
    await user.save()

    count++
    console.log(`  ${user.name} — ${redeemCode} | ${r.ornament} | ${grams.toFixed(4)}g | ₹${goldValue.toLocaleString('en-IN')} | ${redeemStatus} | Feb ${r.day}`)
  }

  console.log(`\nDone! ${count} February redemptions seeded.`)
  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
