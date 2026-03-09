const cards = [
  {
    key: 'avgInvestment',
    label: 'Avg Investment',
    subtitle: 'Per buy transaction',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    valueColor: 'text-[#6B1532]',
    iconBg: 'bg-[#6B1532]/10',
    iconColor: 'text-[#6B1532]',
    barColor: 'bg-[#6B1532]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    key: 'avgRedemption',
    label: 'Avg Redemption',
    subtitle: 'Per redemption transaction',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    valueColor: 'text-[#6B1532]',
    iconBg: 'bg-[#D4AF37]/10',
    iconColor: 'text-[#D4AF37]',
    barColor: 'bg-[#D4AF37]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: 'avgOrnament',
    label: 'Avg Ornament Price',
    subtitle: 'Per ornament order',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
    valueColor: 'text-[#D4AF37]',
    iconBg: 'bg-[#D4AF37]/10',
    iconColor: 'text-[#D4AF37]',
    barColor: 'bg-[#D4AF37]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
]

export default function AveragesSection({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-[#E5E5E5]">
            <div className="h-10 w-10 bg-[#F0F0F0] rounded-xl mb-4" />
            <div className="h-4 bg-[#F0F0F0] rounded w-2/3 mb-3" />
            <div className="h-8 bg-[#F0F0F0] rounded w-1/2 mb-2" />
            <div className="h-1.5 bg-[#F0F0F0] rounded-full w-full" />
          </div>
        ))}
      </div>
    )
  }

  const averages = data || { avgInvestment: 0, avgRedemption: 0, avgOrnament: 0 }

  // For visual bar — normalize against max of the three
  const values = [averages.avgInvestment, averages.avgRedemption, averages.avgOrnament]
  const maxVal = Math.max(...values, 1)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div
          key={card.key}
          className="relative overflow-hidden bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} mb-4`}>
            {card.icon}
          </div>
          <span className="text-[#1a1a1a] text-sm font-semibold">{card.label}</span>
          <p className={`${card.valueColor} text-3xl font-bold mt-1 mb-2`}>
            {card.format(averages[card.key])}
          </p>

          {/* Visual bar */}
          <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${card.barColor} rounded-full transition-all duration-700 ease-out opacity-40`}
              style={{ width: `${Math.max((values[idx] / maxVal) * 100, 4)}%` }}
            />
          </div>
          <p className="text-[#aaa] text-[10px] mt-2">{card.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
