const User = require('../models/User')
const Transaction = require('../models/Transaction')
const Payment = require('../models/Payment')
const Ornament = require('../models/Ornament')
const GoldRate = require('../models/GoldRate')

// Helper: get start of today in UTC
function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

// Helper: get start of a given month
function startOfMonth(year, month) {
  return new Date(year, month, 1)
}

// ─────────────────────────────────────────────
// GET /api/admin/dashboard-summary
// ─────────────────────────────────────────────
async function getDashboardSummary(req, res) {
  try {
    const todayStart = startOfToday()

    // Run all queries in parallel for speed
    const [
      totalCustomers,
      customersToday,
      paymentsToday,
      revenueToday,
      goldPurchasedToday,
    ] = await Promise.all([
      // 1. Total customers (exclude admins)
      User.countDocuments({ role: 'user' }),

      // 2. Customers joined today
      User.countDocuments({ role: 'user', createdAt: { $gte: todayStart } }),

      // 3. Total payments today (successful only)
      Payment.countDocuments({ status: 'success', createdAt: { $gte: todayStart } }),

      // 4. Total revenue today (sum of successful payment amounts)
      Payment.aggregate([
        { $match: { status: 'success', createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // 5. Total gold purchased today (sum of grams from buy transactions)
      Transaction.aggregate([
        { $match: { type: 'buy', createdAt: { $gte: todayStart } } },
        { $group: { _id: null, totalGrams: { $sum: '$grams' }, totalAmount: { $sum: '$amount' } } },
      ]),
    ])

    res.json({
      totalCustomers,
      customersToday,
      paymentsToday,
      revenueToday: revenueToday[0]?.total || 0,
      goldPurchasedToday: {
        grams: goldPurchasedToday[0]?.totalGrams || 0,
        amount: goldPurchasedToday[0]?.totalAmount || 0,
      },
    })
  } catch (error) {
    console.error('Dashboard summary error:', error.message)
    res.status(500).json({ error: 'Failed to fetch dashboard summary' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/daily-report?date=2026-02-24
// ─────────────────────────────────────────────
async function getDailyReport(req, res) {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0]
    const dayStart = new Date(dateStr)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const [transactions, payments, newCustomers] = await Promise.all([
      // Transactions grouped by type
      Transaction.aggregate([
        { $match: { createdAt: { $gte: dayStart, $lt: dayEnd } } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalGrams: { $sum: '$grams' },
          },
        },
      ]),

      // Payments grouped by method
      Payment.aggregate([
        { $match: { status: 'success', createdAt: { $gte: dayStart, $lt: dayEnd } } },
        {
          $group: {
            _id: '$method',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),

      // New customers count
      User.countDocuments({ role: 'user', createdAt: { $gte: dayStart, $lt: dayEnd } }),
    ])

    res.json({
      date: dateStr,
      newCustomers,
      transactions,
      payments,
    })
  } catch (error) {
    console.error('Daily report error:', error.message)
    res.status(500).json({ error: 'Failed to fetch daily report' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/monthly-report?year=2026&month=2
// ─────────────────────────────────────────────
async function getMonthlyReport(req, res) {
  try {
    const now = new Date()
    const year = parseInt(req.query.year) || now.getFullYear()
    const month = parseInt(req.query.month) || now.getMonth() + 1
    const monthStart = startOfMonth(year, month - 1)
    const monthEnd = startOfMonth(year, month)

    const [dailyRevenue, transactionSummary, newCustomers, paymentMethods] = await Promise.all([
      // Revenue per day (for chart)
      Payment.aggregate([
        { $match: { status: 'success', createdAt: { $gte: monthStart, $lt: monthEnd } } },
        {
          $group: {
            _id: { $dayOfMonth: '$createdAt' },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Transaction totals for the month
      Transaction.aggregate([
        { $match: { createdAt: { $gte: monthStart, $lt: monthEnd } } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalGrams: { $sum: '$grams' },
          },
        },
      ]),

      // New customers this month
      User.countDocuments({ role: 'user', createdAt: { $gte: monthStart, $lt: monthEnd } }),

      // Payment methods breakdown
      Payment.aggregate([
        { $match: { status: 'success', createdAt: { $gte: monthStart, $lt: monthEnd } } },
        {
          $group: {
            _id: '$method',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
    ])

    res.json({
      year,
      month,
      newCustomers,
      dailyRevenue,
      transactionSummary,
      paymentMethods,
    })
  } catch (error) {
    console.error('Monthly report error:', error.message)
    res.status(500).json({ error: 'Failed to fetch monthly report' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/customers?page=1&limit=10&search=john&from=2026-01-01&to=2026-02-24
// ─────────────────────────────────────────────
async function getCustomers(req, res) {
  try {
    const { page = 1, limit = 10, search, from, to } = req.query
    const filter = { role: 'user' }

    // Search by name, email, or phone
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    // Date range filter
    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [customers, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ])

    res.json({
      customers,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    })
  } catch (error) {
    console.error('Customers error:', error.message)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/payments?page=1&limit=10&status=success&from=2026-01-01&to=2026-02-24
// ─────────────────────────────────────────────
async function getPayments(req, res) {
  try {
    const { page = 1, limit = 10, status, method, from, to } = req.query
    const filter = {}

    if (status && ['success', 'pending', 'failed'].includes(status)) {
      filter.status = status
    }

    if (method && ['upi', 'card', 'netbanking', 'wallet'].includes(method)) {
      filter.method = method
    }

    // Date range filter
    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('userId', 'name email phone')
        .populate('transactionId', 'type grams pricePerGram')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(filter),
    ])

    res.json({
      payments,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    })
  } catch (error) {
    console.error('Payments error:', error.message)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/dashboard-extended?period=today
// ─────────────────────────────────────────────

// Helper: get start date for a given period (returns null for 'all' = no filter)
function getPeriodStart(period) {
  if (period === 'all') return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (period === 'week') {
    const day = now.getDay()
    const diff = day === 0 ? 6 : day - 1 // Monday = 0 offset
    now.setDate(now.getDate() - diff)
  } else if (period === 'month') {
    now.setDate(1) // start of month
  } else if (period === 'lastMonth') {
    now.setDate(1) // go to 1st of current month
    now.setMonth(now.getMonth() - 1) // back to 1st of previous month
  }
  return now
}

// Helper: get end date for periods that need an upper bound
function getPeriodEnd(period) {
  if (period === 'lastMonth') {
    const end = new Date()
    end.setHours(0, 0, 0, 0)
    end.setDate(1) // 1st of current month = upper bound for last month
    return end
  }
  return null
}

// Helper: build a createdAt filter from period
function periodFilter(period) {
  const start = getPeriodStart(period)
  const end = getPeriodEnd(period)
  if (!start && !end) return {} // 'all' — no date filter
  const filter = {}
  if (start) filter.$gte = start
  if (end) filter.$lt = end
  return filter
}

async function getDashboardExtended(req, res) {
  try {
    const period = req.query.period || 'today'
    const dateFilter = periodFilter(period)
    // Build createdAt match — empty object when 'all' (no date restriction)
    const dateMatch = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}

    const [
      redemptionStats,
      allTimeInvestment,
      allTimeRedemption,
      periodInvestment,
      ornamentStats,
      recentOrnaments,
      avgInvestment,
      avgRedemption,
      avgOrnament,
      redemptionCustomers,
      categoryBreakdown,
      latestGoldRate,
      recentPurchases,
    ] = await Promise.all([
      // 1. Redemption stats for period
      Transaction.aggregate([
        { $match: { type: 'redeem', ...dateMatch } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalGrams: { $sum: '$grams' },
            customers: { $addToSet: '$userId' },
          },
        },
      ]),

      // 2. All-time investment totals (for corpus balance)
      Transaction.aggregate([
        { $match: { type: 'buy' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalGrams: { $sum: '$grams' },
          },
        },
      ]),

      // 3. All-time redemption totals (for corpus balance)
      Transaction.aggregate([
        { $match: { type: 'redeem' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalGrams: { $sum: '$grams' },
          },
        },
      ]),

      // 4. Period-filtered investment totals (buy)
      Transaction.aggregate([
        { $match: { type: 'buy', ...dateMatch } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalGrams: { $sum: '$grams' },
          },
        },
      ]),

      // 5. Ornament stats for period
      Ornament.aggregate([
        { $match: { ...dateMatch, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalValue: { $sum: '$totalPrice' },
            totalWeight: { $sum: '$goldWeightGrams' },
          },
        },
      ]),

      // 6. Recent 10 ornament orders
      Ornament.find(dateMatch)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      // 7. Average investment amount (period-filtered)
      Transaction.aggregate([
        { $match: { type: 'buy', ...dateMatch } },
        { $group: { _id: null, avg: { $avg: '$amount' } } },
      ]),

      // 8. Average redemption amount (period-filtered)
      Transaction.aggregate([
        { $match: { type: 'redeem', ...dateMatch } },
        { $group: { _id: null, avg: { $avg: '$amount' } } },
      ]),

      // 9. Average ornament price (period-filtered, non-cancelled)
      Ornament.aggregate([
        { $match: { status: { $ne: 'cancelled' }, ...dateMatch } },
        { $group: { _id: null, avg: { $avg: '$totalPrice' } } },
      ]),

      // 10. Distinct redemption customers for period
      Transaction.distinct('userId', { type: 'redeem', ...dateMatch }),

      // 11. Ornament category breakdown for period
      Ornament.aggregate([
        { $match: { ...dateMatch, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalPrice' },
            totalWeight: { $sum: '$goldWeightGrams' },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // 12. Latest gold rate for worth calculation
      GoldRate.findOne().sort({ date: -1 }).lean(),

      // 13. Buy transactions for period (with customer details)
      Transaction.find({ type: 'buy', ...dateMatch })
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .lean(),
    ])

    const allInvested = allTimeInvestment[0] || { totalAmount: 0, totalGrams: 0 }
    const allRedeemed = allTimeRedemption[0] || { totalAmount: 0, totalGrams: 0 }
    const pInvested = periodInvestment[0] || { totalAmount: 0, totalGrams: 0 }
    const periodRedemption = redemptionStats[0] || { totalAmount: 0, totalGrams: 0, customers: [] }
    const periodOrnaments = ornamentStats[0] || { count: 0, totalValue: 0, totalWeight: 0 }
    const currentGoldRate = latestGoldRate?.rate22K || 0

    res.json({
      redemption: {
        customers: redemptionCustomers.length,
        amount: periodRedemption.totalAmount,
        grams: periodRedemption.totalGrams,
      },
      corpus: {
        balance: allInvested.totalAmount - allRedeemed.totalAmount,
        totalInvested: pInvested.totalAmount,
        totalRedeemed: periodRedemption.totalAmount,
      },
      goldInvested: {
        totalGrams: pInvested.totalGrams,
        totalAmount: pInvested.totalGrams * currentGoldRate,
      },
      ornaments: {
        count: periodOrnaments.count,
        totalValue: periodOrnaments.totalValue,
        totalWeight: periodOrnaments.totalWeight,
        recent: recentOrnaments,
        categoryBreakdown: categoryBreakdown.map((c) => ({
          category: c._id,
          count: c.count,
          totalValue: c.totalValue,
          totalWeight: c.totalWeight,
        })),
      },
      averages: {
        avgInvestment: avgInvestment[0]?.avg || 0,
        avgRedemption: avgRedemption[0]?.avg || 0,
        avgOrnament: avgOrnament[0]?.avg || 0,
      },
      recentPurchases,
    })
  } catch (error) {
    console.error('Dashboard extended error:', error.message)
    res.status(500).json({ error: 'Failed to fetch extended dashboard data' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/ornaments/category-stats?status=ordered&from=2026-01-01&to=2026-02-24
// ─────────────────────────────────────────────
async function getOrnamentCategoryStats(req, res) {
  try {
    const { status, from, to } = req.query
    const match = {}

    if (status && ['ordered', 'processing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      match.status = status
    }

    if (from || to) {
      match.createdAt = {}
      if (from) match.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        match.createdAt.$lt = toDate
      }
    }

    const results = await Ornament.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ['$category', 'chain'] }, then: 'chain' },
                { case: { $eq: ['$category', 'ring'] }, then: 'ring' },
                { case: { $eq: ['$category', 'coin'] }, then: 'coin' },
                { case: { $eq: ['$category', 'necklace'] }, then: 'necklace' },
                { case: { $eq: ['$category', 'earring'] }, then: 'earring' },
              ],
              default: 'others',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    res.json(results.map((r) => ({ category: r._id, count: r.count })))
  } catch (error) {
    console.error('Ornament category stats error:', error.message)
    res.status(500).json({ error: 'Failed to fetch ornament category stats' })
  }
}

// ─────────────────────────────────────────────
// CSV Helpers
// ─────────────────────────────────────────────
function escapeCSV(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCSV(headers, rows) {
  const headerLine = headers.map((h) => escapeCSV(h.label)).join(',')
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCSV(h.getValue(row))).join(',')
  )
  return [headerLine, ...dataLines].join('\n')
}

function sendCSV(res, filename, csvContent) {
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csvContent)
}

// ─────────────────────────────────────────────
// GET /api/admin/customers/export?search=&from=&to=
// ─────────────────────────────────────────────
async function exportCustomers(req, res) {
  try {
    const { search, from, to } = req.query
    const filter = { role: 'user' }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const customers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()

    const headers = [
      { label: 'Name', getValue: (c) => c.name },
      { label: 'Email', getValue: (c) => c.email },
      { label: 'Phone', getValue: (c) => c.phone },
      { label: 'City', getValue: (c) => c.city },
      { label: 'Gold Balance (g)', getValue: (c) => c.goldBalance },
      { label: 'Total Invested (₹)', getValue: (c) => c.totalInvested },
      { label: 'Wallet Balance (₹)', getValue: (c) => c.walletBalance },
      { label: 'PAN', getValue: (c) => c.pan },
      { label: 'Joined', getValue: (c) => new Date(c.createdAt).toLocaleDateString('en-IN') },
    ]

    const csv = toCSV(headers, customers)
    const dateTag = new Date().toISOString().split('T')[0]
    sendCSV(res, `customers_${dateTag}.csv`, csv)
  } catch (error) {
    console.error('Export customers error:', error.message)
    res.status(500).json({ error: 'Failed to export customers' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/payments/export?status=&method=&from=&to=
// ─────────────────────────────────────────────
async function exportPayments(req, res) {
  try {
    const { status, method, from, to } = req.query
    const filter = {}

    if (status && ['success', 'pending', 'failed'].includes(status)) {
      filter.status = status
    }
    if (method && ['upi', 'card', 'netbanking', 'wallet'].includes(method)) {
      filter.method = method
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const payments = await Payment.find(filter)
      .populate('userId', 'name email phone')
      .populate('transactionId', 'type grams pricePerGram')
      .sort({ createdAt: -1 })
      .lean()

    const headers = [
      { label: 'Customer Name', getValue: (p) => p.userId?.name },
      { label: 'Customer Email', getValue: (p) => p.userId?.email },
      { label: 'Amount (₹)', getValue: (p) => p.amount },
      { label: 'Method', getValue: (p) => p.method },
      { label: 'Status', getValue: (p) => p.status },
      { label: 'Transaction Type', getValue: (p) => p.transactionId?.type },
      { label: 'Gold (g)', getValue: (p) => p.transactionId?.grams },
      { label: 'Reference ID', getValue: (p) => p.referenceId },
      { label: 'Date', getValue: (p) => new Date(p.createdAt).toLocaleString('en-IN') },
    ]

    const csv = toCSV(headers, payments)
    const dateTag = new Date().toISOString().split('T')[0]
    sendCSV(res, `payments_${dateTag}.csv`, csv)
  } catch (error) {
    console.error('Export payments error:', error.message)
    res.status(500).json({ error: 'Failed to export payments' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/daily-report/export?date=2026-02-24
// ─────────────────────────────────────────────
async function exportDailyReport(req, res) {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0]
    const dayStart = new Date(dateStr)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const transactions = await Transaction.find({ createdAt: { $gte: dayStart, $lt: dayEnd } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    const headers = [
      { label: 'Customer', getValue: (t) => t.userId?.name },
      { label: 'Email', getValue: (t) => t.userId?.email },
      { label: 'Type', getValue: (t) => t.type },
      { label: 'Gold (g)', getValue: (t) => t.grams },
      { label: 'Amount (₹)', getValue: (t) => t.amount },
      { label: 'Price/g (₹)', getValue: (t) => t.pricePerGram },
      { label: 'Status', getValue: (t) => t.status },
      { label: 'Time', getValue: (t) => new Date(t.createdAt).toLocaleTimeString('en-IN') },
    ]

    const csv = toCSV(headers, transactions)
    sendCSV(res, `daily_report_${dateStr}.csv`, csv)
  } catch (error) {
    console.error('Export daily report error:', error.message)
    res.status(500).json({ error: 'Failed to export daily report' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/monthly-report/export?year=2026&month=2
// ─────────────────────────────────────────────
async function exportMonthlyReport(req, res) {
  try {
    const now = new Date()
    const year = parseInt(req.query.year) || now.getFullYear()
    const month = parseInt(req.query.month) || now.getMonth() + 1
    const monthStart = startOfMonth(year, month - 1)
    const monthEnd = startOfMonth(year, month)

    const transactions = await Transaction.find({ createdAt: { $gte: monthStart, $lt: monthEnd } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    const headers = [
      { label: 'Date', getValue: (t) => new Date(t.createdAt).toLocaleDateString('en-IN') },
      { label: 'Customer', getValue: (t) => t.userId?.name },
      { label: 'Email', getValue: (t) => t.userId?.email },
      { label: 'Type', getValue: (t) => t.type },
      { label: 'Gold (g)', getValue: (t) => t.grams },
      { label: 'Amount (₹)', getValue: (t) => t.amount },
      { label: 'Price/g (₹)', getValue: (t) => t.pricePerGram },
      { label: 'Status', getValue: (t) => t.status },
    ]

    const csv = toCSV(headers, transactions)
    const monthStr = String(month).padStart(2, '0')
    sendCSV(res, `monthly_report_${year}_${monthStr}.csv`, csv)
  } catch (error) {
    console.error('Export monthly report error:', error.message)
    res.status(500).json({ error: 'Failed to export monthly report' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/ornaments?page=1&limit=10&category=ring&status=ordered&from=&to=
// ─────────────────────────────────────────────
async function getOrnaments(req, res) {
  try {
    const { page = 1, limit = 10, category, status, from, to } = req.query
    const filter = {}

    if (category && ['coin', 'ring', 'necklace', 'bracelet', 'earring', 'bangle', 'pendant', 'chain', 'other'].includes(category)) {
      filter.category = category
    }

    if (status && ['ordered', 'processing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      filter.status = status
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [ornaments, total] = await Promise.all([
      Ornament.find(filter)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Ornament.countDocuments(filter),
    ])

    res.json({
      ornaments,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    })
  } catch (error) {
    console.error('Ornaments error:', error.message)
    res.status(500).json({ error: 'Failed to fetch ornaments' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/ornaments/export?category=&status=&from=&to=
// ─────────────────────────────────────────────
async function exportOrnaments(req, res) {
  try {
    const { category, status, from, to } = req.query
    const filter = {}

    if (category && ['coin', 'ring', 'necklace', 'bracelet', 'earring', 'bangle', 'pendant', 'chain', 'other'].includes(category)) {
      filter.category = category
    }
    if (status && ['ordered', 'processing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      filter.status = status
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const ornaments = await Ornament.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()

    const headers = [
      { label: 'Customer Name', getValue: (o) => o.userId?.name },
      { label: 'Customer Email', getValue: (o) => o.userId?.email },
      { label: 'Ornament', getValue: (o) => o.ornamentName },
      { label: 'Category', getValue: (o) => o.category },
      { label: 'Gold Weight (g)', getValue: (o) => o.goldWeightGrams },
      { label: 'Price/g (₹)', getValue: (o) => o.pricePerGram },
      { label: 'Making Charges (₹)', getValue: (o) => o.makingCharges },
      { label: 'Total Price (₹)', getValue: (o) => o.totalPrice },
      { label: 'Status', getValue: (o) => o.status },
      { label: 'Date', getValue: (o) => new Date(o.createdAt).toLocaleDateString('en-IN') },
    ]

    const csv = toCSV(headers, ornaments)
    const dateTag = new Date().toISOString().split('T')[0]
    sendCSV(res, `ornaments_${dateTag}.csv`, csv)
  } catch (error) {
    console.error('Export ornaments error:', error.message)
    res.status(500).json({ error: 'Failed to export ornaments' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/redeem-verify?code=RDM-482913
// ─────────────────────────────────────────────
async function lookupRedeemCode(req, res) {
  try {
    const { code } = req.query
    if (!code) {
      return res.status(400).json({ error: 'Redeem code is required' })
    }

    const ornament = await Ornament.findOne({ redeemCode: code })
      .populate('userId', 'name email phone')
      .lean()

    if (!ornament) {
      return res.status(404).json({ error: 'No redemption found for this code' })
    }

    res.json({
      ornamentId: ornament._id,
      userId: ornament.userId?._id,
      redeemCode: ornament.redeemCode,
      redeemStatus: ornament.redeemStatus,
      customer: {
        name: ornament.userId?.name,
        email: ornament.userId?.email,
        phone: ornament.userId?.phone,
      },
      ornamentName: ornament.ornamentName,
      category: ornament.category,
      goldRedeemed: ornament.goldWeightGrams,
      redeemValue: ornament.totalPrice,
      date: ornament.createdAt,
    })
  } catch (error) {
    console.error('Lookup redeem code error:', error.message)
    res.status(500).json({ error: 'Failed to lookup redeem code' })
  }
}

// ─────────────────────────────────────────────
// PATCH /api/admin/redeem-verify/:ornamentId/confirm
// ─────────────────────────────────────────────
async function confirmRedemption(req, res) {
  try {
    const ornament = await Ornament.findById(req.params.ornamentId)
    if (!ornament) {
      return res.status(404).json({ error: 'Ornament not found' })
    }
    if (!ornament.redeemCode) {
      return res.status(400).json({ error: 'This ornament has no redeem code' })
    }
    if (ornament.redeemStatus === 'completed') {
      return res.status(400).json({ error: 'Redemption already confirmed' })
    }

    ornament.redeemStatus = 'completed'
    await ornament.save()

    res.json({ message: 'Redemption confirmed', redeemStatus: 'completed' })
  } catch (error) {
    console.error('Confirm redemption error:', error.message)
    res.status(500).json({ error: 'Failed to confirm redemption' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/redemption-logs?page=1&limit=10&redeemStatus=&from=&to=
// ─────────────────────────────────────────────
async function getRedemptionLogs(req, res) {
  try {
    const { page = 1, limit = 10, redeemStatus, from, to } = req.query
    const filter = { redeemCode: { $exists: true, $ne: null } }

    if (redeemStatus && ['pending', 'completed'].includes(redeemStatus)) {
      filter.redeemStatus = redeemStatus
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [logs, total] = await Promise.all([
      Ornament.find(filter)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Ornament.countDocuments(filter),
    ])

    res.json({
      logs,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    })
  } catch (error) {
    console.error('Redemption logs error:', error.message)
    res.status(500).json({ error: 'Failed to fetch redemption logs' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/redemption-logs/export
// ─────────────────────────────────────────────
async function exportRedemptionLogs(req, res) {
  try {
    const { redeemStatus, from, to } = req.query
    const filter = { redeemCode: { $exists: true, $ne: null } }

    if (redeemStatus && ['pending', 'completed'].includes(redeemStatus)) {
      filter.redeemStatus = redeemStatus
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) {
        const toDate = new Date(to)
        toDate.setDate(toDate.getDate() + 1)
        filter.createdAt.$lt = toDate
      }
    }

    const logs = await Ornament.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()

    const headers = [
      { label: 'Redeem Code', getValue: (o) => o.redeemCode },
      { label: 'Customer Name', getValue: (o) => o.userId?.name },
      { label: 'Customer Email', getValue: (o) => o.userId?.email },
      { label: 'Customer Phone', getValue: (o) => o.userId?.phone },
      { label: 'Ornament', getValue: (o) => o.ornamentName },
      { label: 'Gold Weight (g)', getValue: (o) => o.goldWeightGrams },
      { label: 'Total Price (₹)', getValue: (o) => o.totalPrice },
      { label: 'Redeem Status', getValue: (o) => o.redeemStatus },
      { label: 'Date', getValue: (o) => new Date(o.createdAt).toLocaleString('en-IN') },
    ]

    const csv = toCSV(headers, logs)
    const dateTag = new Date().toISOString().split('T')[0]
    sendCSV(res, `redemption_logs_${dateTag}.csv`, csv)
  } catch (error) {
    console.error('Export redemption logs error:', error.message)
    res.status(500).json({ error: 'Failed to export redemption logs' })
  }
}

// ─────────────────────────────────────────────
// GET /api/admin/customers/:userId/transactions
// ─────────────────────────────────────────────
async function getCustomerTransactions(req, res) {
  try {
    const { userId } = req.params

    const [customer, transactions] = await Promise.all([
      User.findById(userId)
        .select('name email phone goldBalance totalInvested hasRedeemed createdAt')
        .lean(),
      Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .lean(),
    ])

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json({ customer, transactions })
  } catch (error) {
    console.error('Get customer transactions error:', error.message)
    res.status(500).json({ error: 'Failed to fetch customer transactions' })
  }
}

module.exports = {
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
}
