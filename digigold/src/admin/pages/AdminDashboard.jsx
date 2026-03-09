import { useState, useEffect } from 'react'
import { adminApi } from '../utils/adminApi'
import useGoldPrice from '../../hooks/useGoldPrice'
import KPICards from '../components/KPICards'
import PurchasesSection from '../components/PurchasesSection'
import PeriodFilter from '../components/PeriodFilter'
import CorpusCard from '../components/CorpusCard'
import GoldInvestedCard from '../components/GoldInvestedCard'
import RedemptionSection from '../components/RedemptionSection'
import AveragesSection from '../components/AveragesSection'
import OrnamentSection from '../components/OrnamentSection'


export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [extended, setExtended] = useState(null)
  const [extLoading, setExtLoading] = useState(true)
  const [period, setPeriod] = useState('today')

  const { goldPrice, loading: goldLoading } = useGoldPrice()

  useEffect(() => {
    async function fetchData() {
      try {
        const summaryData = await adminApi.getDashboardSummary()
        setSummary(summaryData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchExtended() {
      setExtLoading(true)
      try {
        const data = await adminApi.getDashboardExtended({ period })
        setExtended(data)
      } catch (err) {
        console.error('Extended dashboard error:', err.message)
      } finally {
        setExtLoading(false)
      }
    }
    fetchExtended()
  }, [period])

  return (
    <div className="space-y-6">
      {/* Header + Live Gold Rate */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold">Dashboard <span className="text-[#D4AF37]">Overview</span></h1>
          <p className="text-[#999] text-sm mt-1">Overview of your jewellery business</p>
        </div>
        <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <span className={`w-2 h-2 rounded-full animate-pulse ${goldPrice ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm font-medium text-[#777]">22K</span>
          {goldLoading && !goldPrice ? (
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-lg font-bold text-amber-700">
              ₹{goldPrice ? goldPrice.price22K.toLocaleString('en-IN') : '—'}<span className="text-sm font-normal text-[#999]">/g</span>
            </span>
          )}
          {goldPrice && (
            <span className={`text-sm font-medium ${goldPrice.changePercent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {goldPrice.changePercent >= 0 ? '+' : ''}{goldPrice.changePercent}%
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <KPICards data={summary} loading={loading} />

      {/* Detailed Analytics Header + Period Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[#1a1a1a] text-lg font-bold">Detailed <span className="text-[#D4AF37]">Analytics</span></h2>
          <p className="text-[#999] text-xs mt-0.5">Business performance metrics</p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {/* Corpus + Gold Invested (side by side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CorpusCard data={extended?.corpus} loading={extLoading} />
        <GoldInvestedCard data={extended?.goldInvested} loading={extLoading} />
      </div>

      {/* Customer Redemptions */}
      <div>
        <h3 className="text-[#1a1a1a] text-base font-bold mb-3">Customer Redemptions</h3>
        <RedemptionSection data={extended?.redemption} loading={extLoading} />
      </div>

      {/* Average Ticket Prices */}
      <div>
        <h3 className="text-[#1a1a1a] text-base font-bold mb-3">Average Ticket Prices</h3>
        <AveragesSection data={extended?.averages} loading={extLoading} />
      </div>

      {/* Ornament Procurement */}
      <OrnamentSection data={extended?.ornaments} loading={extLoading} />

      {/* Gold Purchases + Ornament Orders for period */}
      <PurchasesSection purchases={extended?.recentPurchases} ornaments={extended?.ornaments?.recent} loading={extLoading} />
    </div>
  )
}
