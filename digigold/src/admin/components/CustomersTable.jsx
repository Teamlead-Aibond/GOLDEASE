export default function CustomersTable({ customers, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#F0F0F0] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!customers?.length) {
    return (
      <div className="text-center py-12 text-[#ccc] text-sm">
        No customers found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 via-transparent to-[#D4AF37]/5">
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Name</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Email</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden md:table-cell">Phone</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden lg:table-cell">City</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs">Gold (g)</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs hidden sm:table-cell">Invested</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden lg:table-cell">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr
              key={c._id}
              className="border-b border-[#F0F0F0] hover:bg-[#D4AF37]/5 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6B1532]/15 to-[#6B1532]/5 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#6B1532] text-[11px] font-bold">{c.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="text-[#1a1a1a] text-sm font-medium truncate max-w-[120px]">{c.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-[#666] truncate max-w-[160px]">{c.email}</td>
              <td className="py-3 px-4 text-[#666] hidden md:table-cell">{c.phone}</td>
              <td className="py-3 px-4 text-[#666] hidden lg:table-cell">{c.city || '—'}</td>
              <td className="py-3 px-4 text-right text-[#D4AF37] font-semibold">{c.goldBalance?.toFixed(2)}</td>
              <td className="py-3 px-4 text-right text-[#666] hidden sm:table-cell">
                ₹{c.totalInvested?.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-4 text-[#999] text-xs hidden lg:table-cell">
                {new Date(c.createdAt).toLocaleDateString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
