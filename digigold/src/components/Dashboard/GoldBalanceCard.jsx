import { useState, useEffect } from 'react'
import { api } from '../../utils/api'

export default function GoldBalanceCard({ refreshKey }) {
  const [portfolio, setPortfolio] = useState(null)

  useEffect(() => {
    api.getPortfolio()
      .then(setPortfolio)
      .catch(() => {})
  }, [refreshKey])

  const gold = portfolio?.goldBalance ?? 0
  const invested = portfolio?.totalInvested ?? 0
  const currentValue = portfolio?.currentValue ?? 0
  const returns = portfolio?.returns ?? 0
  const returnPercent = portfolio?.returnPercent ?? 0

  return (
    <div className="bg-gradient-to-br from-[#6B1532] to-[#4A0E23] rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden md:col-span-2 lg:col-span-1">
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="mb-4">
          <p className="text-white/60 text-sm">Total Gold Balance</p>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl sm:text-4xl font-bold">{gold.toFixed(3)}</span>
          <span className="text-white/60 text-lg">grams</span>
        </div>

        <p className="text-white/50 text-sm mb-6">
          Worth <span className="text-[#D4AF37] font-semibold">₹{currentValue.toLocaleString('en-IN')}</span>
        </p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-white/40 text-xs">Invested</p>
            <p className="text-sm font-semibold mt-0.5">₹{invested.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Returns</p>
            <p className={`text-sm font-semibold mt-0.5 ${returns >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {returns >= 0 ? '+' : ''}₹{Math.abs(returns).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Profit</p>
            <p className={`text-sm font-semibold mt-0.5 ${returnPercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {returnPercent >= 0 ? '+' : ''}{returnPercent}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
