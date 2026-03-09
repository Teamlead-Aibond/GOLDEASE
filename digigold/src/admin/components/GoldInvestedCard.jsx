export default function GoldInvestedCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 animate-pulse shadow-sm">
        <div className="h-4 bg-[#E5E5E5] rounded w-1/3 mb-4" />
        <div className="h-9 bg-[#E5E5E5] rounded w-1/2 mb-2" />
        <div className="h-4 bg-[#E5E5E5] rounded w-1/3" />
      </div>
    )
  }

  const gold = data || { totalGrams: 0, totalAmount: 0 }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="text-[#1a1a1a] text-sm font-medium">Total Gold Invested</span>
      </div>
      <p className="text-[#D4AF37] text-3xl font-bold mb-1">
        {gold.totalGrams.toFixed(2)}g
      </p>
      <p className="text-[#999] text-sm">
        Worth ₹{Math.round(gold.totalAmount).toLocaleString('en-IN')}
      </p>
    </div>
  )
}
