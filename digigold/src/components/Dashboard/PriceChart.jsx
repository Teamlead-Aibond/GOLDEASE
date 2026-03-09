const chartData = [
  { time: "9AM", price: 5928 },
  { time: "10AM", price: 5945 },
  { time: "11AM", price: 5960 },
  { time: "12PM", price: 5950 },
  { time: "1PM", price: 5975 },
  { time: "2PM", price: 5990 },
  { time: "3PM", price: 5980 },
  { time: "4PM", price: 6000 },
]

export default function PriceChart() {
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const minPrice = Math.min(...chartData.map(d => d.price))
  const range = maxPrice - minPrice

  // Build SVG path
  const width = 600
  const height = 180
  const padding = 10

  const points = chartData.map((d, i) => ({
    x: padding + (i / (chartData.length - 1)) * (width - padding * 2),
    y: padding + (1 - (d.price - minPrice) / range) * (height - padding * 2),
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-[#1C1917] font-semibold">Gold Price Trend</p>
          <p className="text-xs text-[#999] mt-0.5">24K Gold — Today</p>
        </div>
        <div className="flex gap-1">
          {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
            <button
              key={period}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                period === "1D"
                  ? "bg-[#D4AF37] text-white"
                  : "text-[#999] hover:text-[#1C1917] hover:bg-[#F5F5F5]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area */}
          <path d={areaPath} fill="url(#chartGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#D4AF37" stroke="white" strokeWidth="2" />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-2">
          {chartData.map((d) => (
            <span key={d.time} className="text-[10px] text-[#ccc]">{d.time}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
