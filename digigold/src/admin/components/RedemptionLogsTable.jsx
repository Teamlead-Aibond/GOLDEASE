const redeemStatusStyles = {
  pending: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  completed: 'bg-green-50 text-green-600 border border-green-200',
}

export default function RedemptionLogsTable({ logs, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#F0F0F0] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!logs?.length) {
    return (
      <div className="text-center py-12 text-[#ccc] text-sm">
        No redemption logs found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 via-transparent to-[#D4AF37]/5">
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Redeem Code</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs">Customer</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs hidden sm:table-cell">Gold (g)</th>
            <th className="text-right py-3 px-4 text-[#999] font-medium text-xs">Amount</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden md:table-cell">Status</th>
            <th className="text-left py-3 px-4 text-[#999] font-medium text-xs hidden lg:table-cell">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log._id}
              className="border-b border-[#F0F0F0] hover:bg-[#D4AF37]/5 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-mono text-[#D4AF37] font-semibold text-xs">{log.redeemCode}</span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6B1532]/15 to-[#6B1532]/5 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#6B1532] text-[11px] font-bold">
                      {log.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#1a1a1a] text-sm font-medium truncate max-w-[120px]">{log.userId?.name || 'Unknown'}</p>
                    <p className="text-[#ccc] text-[10px] truncate max-w-[120px]">{log.userId?.email || ''}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-[#D4AF37] font-semibold hidden sm:table-cell">
                {log.goldWeightGrams?.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right text-[#1a1a1a] font-medium">
                {'\u20B9'}{log.totalPrice?.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${redeemStatusStyles[log.redeemStatus] || ''}`}>
                  {log.redeemStatus}
                </span>
              </td>
              <td className="py-3 px-4 text-[#999] text-xs hidden lg:table-cell">
                {new Date(log.createdAt).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
