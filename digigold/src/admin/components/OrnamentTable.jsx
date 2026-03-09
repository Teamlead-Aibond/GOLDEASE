const statusStyles = {
  ordered: 'bg-blue-50 text-blue-600 border border-blue-200',
  processing: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  ready: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  delivered: 'bg-green-50 text-green-600 border border-green-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
}

const categoryStyles = {
  coin: 'bg-yellow-50 text-yellow-700',
  ring: 'bg-purple-50 text-purple-700',
  necklace: 'bg-rose-50 text-rose-700',
  bracelet: 'bg-blue-50 text-blue-700',
  earring: 'bg-pink-50 text-pink-700',
  bangle: 'bg-amber-50 text-amber-700',
  pendant: 'bg-teal-50 text-teal-700',
  chain: 'bg-indigo-50 text-indigo-700',
  other: 'bg-gray-50 text-gray-600',
}

export default function OrnamentTable({ ornaments, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#F0F0F0] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!ornaments?.length) {
    return (
      <div className="text-center py-12 text-[#ccc] text-sm">
        No ornaments found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 via-transparent to-[#D4AF37]/5">
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Customer</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Ornament</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden sm:table-cell">Category</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs">Gold (g)</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs">Price</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden sm:table-cell">Redeem</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden md:table-cell">Status</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden lg:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {ornaments.map((o) => (
            <tr
              key={o._id}
              className="border-b border-[#F0F0F0] hover:bg-[#D4AF37]/5 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6B1532]/15 to-[#6B1532]/5 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#6B1532] text-[11px] font-bold">
                      {o.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#1a1a1a] text-sm font-medium truncate max-w-[120px]">{o.userId?.name || 'Unknown'}</p>
                    <p className="text-[#ccc] text-[10px] truncate max-w-[120px]">{o.userId?.email || ''}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-[#666]">{o.ornamentName}</td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${categoryStyles[o.category] || categoryStyles.other}`}>
                  {o.category}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-[#D4AF37] font-semibold">{o.goldWeightGrams?.toFixed(2)}</td>
              <td className="py-3 px-4 text-right text-[#1a1a1a] font-medium">
                ₹{o.totalPrice?.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                  o.redeemStatus === 'completed'
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {o.redeemStatus === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyles[o.status] || ''}`}>
                  {o.status}
                </span>
              </td>
              <td className="py-3 px-4 text-[#999] text-xs hidden lg:table-cell">
                {new Date(o.createdAt).toLocaleDateString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
