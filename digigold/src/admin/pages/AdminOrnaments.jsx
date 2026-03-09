import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '../utils/adminApi'
import { exportCSV } from '../utils/exportCSV'
import OrnamentTable from '../components/OrnamentTable'
import OrnamentPieChart from '../components/OrnamentPieChart'
import DateFilter from '../components/DateFilter'
import Pagination from '../components/Pagination'
import ExportButton from '../components/ExportButton'

export default function AdminOrnaments() {
  const [ornaments, setOrnaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [categoryStats, setCategoryStats] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)

  const fetchCategoryStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const data = await adminApi.getOrnamentCategoryStats({ status, from, to })
      setCategoryStats(data)
    } catch {
      setCategoryStats([])
    } finally {
      setStatsLoading(false)
    }
  }, [status, from, to])

  useEffect(() => {
    fetchCategoryStats()
  }, [fetchCategoryStats])

  const fetchOrnaments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.getOrnaments({ page, limit: 10, category, status, from, to })
      setOrnaments(data.ornaments)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, category, status, from, to])

  useEffect(() => {
    fetchOrnaments()
  }, [fetchOrnaments])

  const resetPage = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold">Ornaments</h1>
          <p className="text-[#999] text-sm mt-1"><span className="text-[#D4AF37] font-semibold">{total}</span> total ornaments</p>
        </div>
        <ExportButton
          label="Export CSV"
          onExport={() => exportCSV.ornaments({ category, status, from, to })}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => resetPage(setCategory)(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            <option value="">All Categories</option>
            <option value="coin">Coin</option>
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bracelet">Bracelet</option>
            <option value="earring">Earring</option>
            <option value="bangle">Bangle</option>
            <option value="pendant">Pendant</option>
            <option value="chain">Chain</option>
            <option value="other">Other</option>
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => resetPage(setStatus)(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="ordered">Ordered</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date filter */}
        <DateFilter
          from={from}
          to={to}
          onFromChange={resetPage(setFrom)}
          onToChange={resetPage(setTo)}
          onClear={() => { setFrom(''); setTo(''); setPage(1) }}
        />
      </div>

      {/* Pie Chart */}
      <OrnamentPieChart data={categoryStats} loading={statsLoading} />

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-2">
        <OrnamentTable ornaments={ornaments} loading={loading} />
        <div className="px-4 pb-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
