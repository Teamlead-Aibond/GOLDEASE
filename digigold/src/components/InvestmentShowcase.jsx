import useGoldPrice from '../hooks/useGoldPrice'

const monthlyPrices = [
  { month: "Jan", price: 7800 },
  { month: "Feb", price: 8100 },
  { month: "Mar", price: 8450 },
  { month: "Apr", price: 8900 },
  { month: "May", price: 9200 },
  { month: "Jun", price: 9500 },
  { month: "Jul", price: 9800 },
  { month: "Aug", price: 10400 },
  { month: "Sep", price: 11200 },
  { month: "Oct", price: 12500 },
  { month: "Nov", price: 13800 },
  { month: "Dec", price: 15650 },
]

const MONTHLY_INVESTMENT = 10000
const TOTAL_INVESTED = 105000
const GOLD_ACCUMULATED = 8.1
const AVG_PURCHASE_PRICE = 12963
const FALLBACK_PRICE = 15650

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function PriceTrendChart() {
  const prices = monthlyPrices.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const width = 600
  const height = 250
  const padX = 50
  const padTop = 20
  const padBottom = 40
  const chartW = width - padX - 20
  const chartH = height - padTop - padBottom

  const points = monthlyPrices.map((d, i) => {
    const x = padX + (i / (monthlyPrices.length - 1)) * chartW
    const y = padTop + chartH - ((d.price - minPrice) / (maxPrice - minPrice)) * chartH
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
  const areaPath = `${linePath} L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`

  // Y-axis ticks
  const tickCount = 5
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = minPrice + ((maxPrice - minPrice) * i) / (tickCount - 1)
    const y = padTop + chartH - ((value - minPrice) / (maxPrice - minPrice)) * chartH
    return { value, y }
  })

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 sm:p-5 mt-6 max-w-2xl mx-auto">
      <h3 className="text-base font-bold text-[#1a1a1a] mb-0.5">22K Gold Price Trend</h3>
      <p className="text-[#666] text-xs mb-3">Monthly average price per gram (Jan – Dec 2025)</p>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[300px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((t, i) => (
            <line key={i} x1={padX} y1={t.y} x2={padX + chartW} y2={t.y} stroke="#E5E5E5" strokeWidth="1" />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#goldGradient)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#D4AF37" stroke="#fff" strokeWidth="2" />
          ))}

          {/* X-axis month labels */}
          {points.map((p, i) => (
            <text key={i} x={p.x} y={height - 8} textAnchor="middle" className="text-[11px] fill-[#1a1a1a] font-semibold">
              {p.month}
            </text>
          ))}

          {/* Y-axis price labels */}
          {yTicks.map((t, i) => (
            <text key={i} x={padX - 8} y={t.y + 4} textAnchor="end" className="text-[10px] fill-[#1a1a1a] font-semibold">
              {(t.value / 1000).toFixed(1)}k
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default function InvestmentShowcase() {
  const { goldPrice } = useGoldPrice()

  const todaysPrice = goldPrice ? Math.round(goldPrice.price22K) : FALLBACK_PRICE
  const currentValue = GOLD_ACCUMULATED * todaysPrice
  const profit = currentValue - TOTAL_INVESTED
  const returnPct = ((profit / TOTAL_INVESTED) * 100).toFixed(1)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Investment Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-2">
            Smart Gold Investing
          </h2>
          <p className="text-[#1a1a1a] mt-3 max-w-2xl mx-auto">
            Invest {formatCurrency(MONTHLY_INVESTMENT)} every month and accumulate gold as prices change.
          </p>
        </div>

        {/* Main Dashboard Card */}
        <div className="bg-gradient-to-br from-[#6B1532] to-[#4A0E23] rounded-3xl p-6 sm:p-8 text-white shadow-2xl">

          {/* 5 Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Total Invested</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{formatCurrency(TOTAL_INVESTED)}</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Gold Accumulated</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{GOLD_ACCUMULATED}<span className="text-lg ml-1">g</span></p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Avg Purchase Price</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{formatCurrency(AVG_PURCHASE_PRICE)}<span className="text-lg"> /g</span></p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Current Value</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{formatCurrency(currentValue)}</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Profit Earned</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">{formatCurrency(profit)}</p>
              <div className="mt-1">
                <span className="bg-green-500/20 border border-green-400/30 rounded-full px-3 py-0.5 text-green-400 font-bold text-xs">+{returnPct}%</span>
              </div>
            </div>
          </div>

          {/* Comparison Box */}
          <div className="bg-white/10 border border-white/20 rounded-xl p-5 sm:p-6">
            <h4 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">Smart Investment Comparison</h4>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold text-sm">If you buy {GOLD_ACCUMULATED}g gold today</span>
                <span className="font-semibold text-lg">{formatCurrency(currentValue)}</span>
              </div>
              <div className="border-t border-white/10" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold text-sm">You invested only</span>
                <span className="font-semibold text-lg">{formatCurrency(TOTAL_INVESTED)}</span>
              </div>
              <div className="border-t border-white/10" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-green-400 text-sm font-medium">You saved by investing early</span>
                <span className="font-bold text-xl text-green-400">{formatCurrency(profit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Trend Chart */}
        <PriceTrendChart />

        {/* CTA */}
        <div className="text-center mt-10">
          <button className="px-8 py-4 bg-[#D4AF37] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#c9a430] transition-all hover:scale-105 text-lg cursor-pointer shadow-lg shadow-[#D4AF37]/20">
            Start Your GoldEase Journey
          </button>
        </div>
      </div>
    </section>
  )
}
