const statusStyles = {
  success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  pending: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  failed: 'bg-red-50 text-red-600 border border-red-200',
}

export default function PaymentsTable({ payments, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#F0F0F0] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!payments?.length) {
    return (
      <div className="text-center py-12 text-[#ccc] text-sm">
        No payments found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 via-transparent to-[#D4AF37]/5">
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Customer</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs">Amount</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden sm:table-cell">Method</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Status</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden md:table-cell">Ref ID</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden lg:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr
              key={p._id}
              className="border-b border-[#F0F0F0] hover:bg-[#D4AF37]/5 transition-colors"
            >
              <td className="py-3 px-4">
                <p className="text-[#1a1a1a] text-sm font-medium truncate max-w-[140px]">{p.userId?.name || '—'}</p>
                <p className="text-[#ccc] text-[10px] truncate max-w-[140px]">{p.userId?.email || ''}</p>
              </td>
              <td className="py-3 px-4 text-right text-[#D4AF37] font-semibold">
                ₹{p.amount?.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="text-[#666] capitalize">{p.method}</span>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyles[p.status] || ''}`}>
                  {p.status}
                </span>
              </td>
              <td className="py-3 px-4 text-[#999] text-xs hidden md:table-cell font-mono">
                {p.referenceId || '—'}
              </td>
              <td className="py-3 px-4 text-[#999] text-xs hidden lg:table-cell">
                {new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
