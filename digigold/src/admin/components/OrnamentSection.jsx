const categoryStyle = {
  bg: 'bg-[#6B1532]/15',
  text: 'text-[#6B1532]',
  dot: 'bg-[#6B1532]',
}

export default function OrnamentSection({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm">
        <div className="px-5 py-4 border-b border-[#E5E5E5]">
          <div className="h-5 bg-[#F0F0F0] rounded w-1/4 animate-pulse" />
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 bg-[#F0F0F0] rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-[#F0F0F0] rounded-lg animate-pulse" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-[#F0F0F0] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const ornaments = data || { count: 0, totalValue: 0, totalWeight: 0, recent: [], categoryBreakdown: [] }

  const stats = [
    {
      label: 'Total Ornaments',
      value: ornaments.count.toLocaleString('en-IN'),
      color: 'text-[#6B1532]',
      icon: (
        <svg className="w-5 h-5 text-[#6B1532]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Total Value',
      value: `₹${ornaments.totalValue.toLocaleString('en-IN')}`,
      color: 'text-[#D4AF37]',
      icon: (
        <svg className="w-5 h-5 text-[#D4AF37]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  // For category bar chart
  const maxCatCount = Math.max(...(ornaments.categoryBreakdown?.map((c) => c.count) || []), 1)

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="px-5 py-4 border-b border-[#E5E5E5]">
        <h3 className="text-[#1a1a1a] text-base font-bold">Ornament Procurement</h3>
        <p className="text-[#ccc] text-xs mt-0.5">Jewellery orders and stats</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 pb-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#1a1a1a] text-sm font-semibold">{s.label}</p>
              {s.icon}
            </div>
            <p className={`${s.color} text-2xl font-bold`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {ornaments.categoryBreakdown?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-[#999] text-xs font-medium mb-3">Purchased by Type</p>
          <div className="space-y-2">
            {ornaments.categoryBreakdown.map((cat) => {
              const colors = categoryStyle
              const barWidth = Math.max((cat.count / maxCatCount) * 100, 6)
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <div className="w-20 flex items-center gap-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${colors.dot} shrink-0`} />
                    <span className="text-[#555] text-xs font-medium capitalize truncate">{cat.category}</span>
                  </div>
                  <div className="flex-1 h-7 bg-[#F0F0F0] rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${colors.bg} rounded-lg flex items-center px-2.5 transition-all duration-500 ease-out shadow-sm`}
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className={`${colors.text} text-[10px] font-bold whitespace-nowrap`}>{cat.count}</span>
                    </div>
                  </div>
                  <span className="text-[#999] text-[10px] font-medium w-24 text-right shrink-0">
                    ₹{cat.totalValue.toLocaleString('en-IN')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
