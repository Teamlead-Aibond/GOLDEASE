import { useState, useEffect } from 'react'
import { api } from '../../utils/api'

const typeStyles = {
  buy: { color: "text-green-600", bg: "bg-green-50", icon: "+" },
  redeem: { color: "text-purple-600", bg: "bg-purple-50", icon: "~" },
}

const statusStyles = {
  completed: "bg-green-50 text-green-600",
  processing: "bg-[#D4AF37]/10 text-[#D4AF37]",
  failed: "bg-red-50 text-red-600",
}

const typeLabels = { buy: "Bought Gold", redeem: "Redeemed" }

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
    d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function RecentTransactions({ refreshKey }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getTransactions({ limit: 5 })
      .then((data) => setTransactions(data.transactions))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [refreshKey])

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[#1C1917] font-semibold">Recent Transactions</p>
        <button className="text-xs text-[#D4AF37] font-medium hover:text-[#B8960C] cursor-pointer">View All</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-sm text-[#999] py-8">No transactions yet. Buy some gold to get started!</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const style = typeStyles[tx.type] || typeStyles.buy
            return (
              <div key={tx._id} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-[#FAFAFA] transition-colors">
                {/* Icon */}
                <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <span className={`${style.color} font-bold text-lg`}>{style.icon}</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1C1917]">{typeLabels[tx.type] || tx.type}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[tx.status] || ''}`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#999] mt-0.5">{formatDate(tx.createdAt)}</p>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${style.color}`}>
                    {tx.type === 'redeem' ? '-' : '+'}{tx.grams.toFixed(2)}g
                  </p>
                  <p className="text-xs text-[#999]">₹{tx.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
