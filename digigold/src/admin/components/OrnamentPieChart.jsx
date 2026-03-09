const COLORS = {
  chain: '#6B1532',    // maroon (brand)
  ring: '#D4AF37',     // gold (brand)
  coin: '#8B7355',     // warm bronze
  necklace: '#A0926B', // muted khaki
  earring: '#7C6E5F',  // taupe
  others: '#B5A898',   // warm gray
}

const LABELS = {
  chain: 'Chain',
  ring: 'Ring',
  coin: 'Coin',
  necklace: 'Necklace',
  earring: 'Earrings',
  others: 'Others',
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

export default function OrnamentPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm p-6">
        <div className="h-5 bg-[#F0F0F0] rounded w-1/3 animate-pulse mb-6" />
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-full bg-[#F0F0F0] animate-pulse shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 bg-[#F0F0F0] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <h3 className="text-[#1a1a1a] text-base font-bold mb-1">Category Distribution</h3>
        <p className="text-[#ccc] text-xs mb-6">Ornament orders by type</p>
        <div className="text-center py-10 text-[#ccc] text-sm bg-[#FAFAFA] rounded-xl">
          No ornament data available for the selected filters
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)

  // Build slices
  const cx = 100
  const cy = 100
  const outerR = 90
  const innerR = 55
  let currentAngle = 0

  const slices = data.map((d) => {
    const angle = (d.count / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle
    return { ...d, startAngle, endAngle, angle }
  })

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <h3 className="text-[#1a1a1a] text-base font-bold mb-1">Category Distribution</h3>
      <p className="text-[#ccc] text-xs mb-6">Ornament orders by type</p>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* SVG Donut */}
        <div className="shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {slices.map((s) => {
              const color = COLORS[s.category] || COLORS.others
              // Full circle case
              if (s.angle >= 359.99) {
                return (
                  <g key={s.category}>
                    <circle cx={cx} cy={cy} r={outerR} fill={color} />
                    <circle cx={cx} cy={cy} r={innerR} fill="white" />
                  </g>
                )
              }
              const outerStart = polarToCartesian(cx, cy, outerR, s.startAngle - 90)
              const outerEnd = polarToCartesian(cx, cy, outerR, s.endAngle - 90)
              const innerStart = polarToCartesian(cx, cy, innerR, s.endAngle - 90)
              const innerEnd = polarToCartesian(cx, cy, innerR, s.startAngle - 90)
              const largeArc = s.angle > 180 ? 1 : 0
              const d = [
                `M ${outerStart.x} ${outerStart.y}`,
                `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
                `L ${innerStart.x} ${innerStart.y}`,
                `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
                'Z',
              ].join(' ')
              return (
                <path
                  key={s.category}
                  d={d}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
              )
            })}
            {/* Center text */}
            <text x={cx} y={cy - 6} textAnchor="middle" className="fill-[#1a1a1a] text-2xl font-bold" style={{ fontSize: '28px', fontWeight: 700 }}>
              {total}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="fill-[#999]" style={{ fontSize: '11px' }}>
              Total Orders
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2.5">
          {slices.map((s) => {
            const pct = ((s.count / total) * 100).toFixed(1)
            const color = COLORS[s.category] || COLORS.others
            const label = LABELS[s.category] || s.category
            return (
              <div key={s.category} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[#555] text-sm font-medium w-20">{label}</span>
                <div className="flex-1 h-2 bg-black/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-[#1a1a1a] text-sm font-semibold w-8 text-right">{s.count}</span>
                <span className="text-[#999] text-xs w-14 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
