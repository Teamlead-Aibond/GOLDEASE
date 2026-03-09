import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '../utils/adminApi'
import { exportCSV } from '../utils/exportCSV'
import CustomersTable from '../components/CustomersTable'
import DateFilter from '../components/DateFilter'
import Pagination from '../components/Pagination'
import ExportButton from '../components/ExportButton'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.getCustomers({ page, limit: 10, search, from, to })
      setCustomers(data.customers)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, from, to])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Reset to page 1 when filters change
  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleFromChange = (value) => {
    setFrom(value)
    setPage(1)
  }

  const handleToChange = (value) => {
    setTo(value)
    setPage(1)
  }

  const handleClearDates = () => {
    setFrom('')
    setTo('')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold">Customers</h1>
          <p className="text-[#999] text-sm mt-1"><span className="text-[#D4AF37] font-semibold">{total}</span> total customers</p>
        </div>
        <ExportButton
          label="Export CSV"
          onExport={() => exportCSV.customers({ search, from, to })}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name, email, or phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          />
        </div>

        {/* Date filter */}
        <DateFilter
          from={from}
          to={to}
          onFromChange={handleFromChange}
          onToChange={handleToChange}
          onClear={handleClearDates}
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
        <CustomersTable customers={customers} loading={loading} />
        <div className="px-4 pb-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
