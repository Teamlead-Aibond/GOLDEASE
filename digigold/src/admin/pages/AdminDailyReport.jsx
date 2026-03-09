import { useState, useEffect } from 'react'
import { adminApi } from '../utils/adminApi'
import { exportCSV } from '../utils/exportCSV'
import ExportButton from '../components/ExportButton'

export default function AdminDailyReport() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchReport() {
      setLoading(true)
      setError('')
      try {
        const data = await adminApi.getDailyReport({ date })
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [date])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold">Daily <span className="text-[#D4AF37]">Report</span></h1>
          <p className="text-[#999] text-sm mt-1">Breakdown for a specific day</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          />
          <ExportButton
            label="Export"
            onExport={() => exportCSV.dailyReport({ date })}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-[#F0F0F0] rounded w-1/2 mb-4" />
              <div className="h-6 bg-[#F0F0F0] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : report && (
        <div className="space-y-6">
          {/* New Customers */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-[#999] text-xs font-medium mb-2">New Customers</h3>
            <p className="text-[#6B1532] text-3xl font-bold">{report.newCustomers}</p>
          </div>

          {/* Payments by Method */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 to-transparent rounded-t-2xl">
              <h3 className="text-[#1a1a1a] text-sm font-semibold">Payments by Method</h3>
            </div>
            {report.payments.length === 0 ? (
              <div className="p-6 text-center text-[#ccc] text-sm">No payments on this day</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 via-transparent to-[#D4AF37]/5">
                      <th className="text-left py-3 px-6 text-[#999] font-medium text-xs">Method</th>
                      <th className="text-right py-3 px-6 text-[#999] font-medium text-xs">Count</th>
                      <th className="text-right py-3 px-6 text-[#999] font-medium text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.payments.map((p) => (
                      <tr key={p._id} className="border-b border-[#F0F0F0] hover:bg-[#D4AF37]/5 transition-colors">
                        <td className="py-3 px-6 text-[#1a1a1a] font-medium capitalize">{p._id}</td>
                        <td className="py-3 px-6 text-right text-[#666]">{p.count}</td>
                        <td className="py-3 px-6 text-right text-[#D4AF37] font-semibold">₹{p.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
