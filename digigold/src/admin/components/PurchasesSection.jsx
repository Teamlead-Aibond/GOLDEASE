const categoryBadge = {
  buy: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  coin: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  ring: 'bg-purple-50 text-purple-700 border border-purple-200',
  necklace: 'bg-rose-50 text-rose-700 border border-rose-200',
  bracelet: 'bg-blue-50 text-blue-700 border border-blue-200',
  earring: 'bg-pink-50 text-pink-700 border border-pink-200',
  bangle: 'bg-amber-50 text-amber-700 border border-amber-200',
  pendant: 'bg-teal-50 text-teal-700 border border-teal-200',
  chain: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  other: 'bg-gray-50 text-gray-600 border border-gray-200',
}

export default function PurchasesSection({ purchases, ornaments, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm">
        <div className="px-5 py-4 border-b border-[#E5E5E5]">
          <div className="h-5 bg-[#F0F0F0] rounded w-1/4 animate-pulse" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-[#F0F0F0] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Normalize both into a unified list sorted by date (newest first)
  const buyRows = (purchases || []).map((p) => ({
    _id: p._id,
    type: 'buy',
    name: p.userId?.name || 'Unknown',
    detail: `${p.grams?.toFixed(4)}g gold`,
    amount: p.amount,
    grams: p.grams,
    rate: p.pricePerGram,
    date: p.createdAt,
  }))

  const ornamentRows = (ornaments || []).map((o) => ({
    _id: o._id,
    type: 'ornament',
    category: o.category || 'other',
    name: o.userId?.name || 'Unknown',
    detail: o.ornamentName,
    amount: o.totalPrice,
    grams: o.goldWeightGrams,
    rate: o.pricePerGram,
    date: o.createdAt,
  }))

  const allRows = [...buyRows, ...ornamentRows].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between bg-gradient-to-r from-[#6B1532]/5 to-transparent rounded-t-2xl">
        <div>
          <h3 className="text-[#1a1a1a] text-base font-bold">Gold Purchases & Ornaments</h3>
          <p className="text-[#ccc] text-xs mt-0.5">
            {buyRows.length} purchase{buyRows.length !== 1 ? 's' : ''} &middot; {ornamentRows.length} ornament{ornamentRows.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {!allRows.length ? (
        <div className="text-center py-8 text-[#ccc] text-sm">No transactions in this period</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="text-left py-2.5 px-4 text-[#1a1a1a] font-medium text-xs">Customer</th>
                <th className="text-left py-2.5 px-4 text-[#1a1a1a] font-medium text-xs">Type</th>
                <th className="text-right py-2.5 px-4 text-[#1a1a1a] font-medium text-xs">Amount</th>
                <th className="text-right py-2.5 px-4 text-[#1a1a1a] font-medium text-xs">Gold (g)</th>
                <th className="text-right py-2.5 px-4 text-[#1a1a1a] font-medium text-xs hidden lg:table-cell">Rate/g</th>
                <th className="text-left py-2.5 px-4 text-[#1a1a1a] font-medium text-xs hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map((r) => (
                <tr key={r._id} className="border-b border-[#F0F0F0] last:border-b-0 hover:bg-[#D4AF37]/5 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gradient-to-br from-[#6B1532]/15 to-[#6B1532]/5 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-[#6B1532] text-[10px] font-bold">
                          {r.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[#1a1a1a] text-sm font-medium truncate max-w-[120px]">
                        {r.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      r.type === 'buy'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {r.type === 'buy' ? 'Buy' : 'Redeemed'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#1a1a1a] font-medium">
                    ₹{r.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#D4AF37] font-semibold">
                    {r.grams?.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#666] hidden lg:table-cell">
                    ₹{r.rate?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-[#999] text-xs hidden lg:table-cell">
                    {new Date(r.date).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
