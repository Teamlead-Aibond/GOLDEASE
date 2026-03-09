import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '../utils/adminApi'
import { exportCSV } from '../utils/exportCSV'
import PaymentsTable from '../components/PaymentsTable'
import DateFilter from '../components/DateFilter'
import Pagination from '../components/Pagination'
import ExportButton from '../components/ExportButton'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [method, setMethod] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.getPayments({ page, limit: 10, status, method, from, to })
      setPayments(data.payments)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, status, method, from, to])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const resetPage = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold">Payments</h1>
          <p className="text-[#999] text-sm mt-1"><span className="text-[#D4AF37] font-semibold">{total}</span> total payments</p>
        </div>
        <ExportButton
          label="Export CSV"
          onExport={() => exportCSV.payments({ status, method, from, to })}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => resetPage(setStatus)(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Method filter */}
          <select
            value={method}
            onChange={(e) => resetPage(setMethod)(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            <option value="">All Methods</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Wallet</option>
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

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-2">
        <PaymentsTable payments={payments} loading={loading} />
        <div className="px-4 pb-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
