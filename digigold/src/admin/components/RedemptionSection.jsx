const cards = [
  {
    key: 'customers',
    label: 'Customers Redeemed',
    format: (v) => v.toLocaleString('en-IN'),
    valueColor: 'text-[#6B1532]',
    iconBg: 'bg-[#6B1532]/10',
    iconColor: 'text-[#6B1532]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'amount',
    label: 'Redeemed Value',
    format: (v) => `₹${v.toLocaleString('en-IN')}`,
    valueColor: 'text-[#6B1532]',
    iconBg: 'bg-[#D4AF37]/10',
    iconColor: 'text-[#D4AF37]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'grams',
    label: 'Gold Redeemed',
    format: (v) => `${v.toFixed(2)}g`,
    valueColor: 'text-[#D4AF37]',
    iconBg: 'bg-[#D4AF37]/10',
    iconColor: 'text-[#D4AF37]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
]

export default function RedemptionSection({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-[#E5E5E5]">
            <div className="h-10 w-10 bg-[#E5E5E5] rounded-xl mb-4" />
            <div className="h-4 bg-[#E5E5E5] rounded w-2/3 mb-3" />
            <div className="h-8 bg-[#E5E5E5] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  const redemption = data || { customers: 0, amount: 0, grams: 0 }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} mb-4`}>
            {card.icon}
          </div>
          <span className="text-[#1a1a1a] text-sm font-semibold">{card.label}</span>
          <p className={`${card.valueColor} text-3xl font-bold mt-1`}>
            {card.format(redemption[card.key])}
          </p>
        </div>
      ))}
    </div>
  )
}
