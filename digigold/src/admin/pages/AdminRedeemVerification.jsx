import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '../utils/adminApi'
import { exportCSV } from '../utils/exportCSV'
import RedemptionLogsTable from '../components/RedemptionLogsTable'
import DateFilter from '../components/DateFilter'
import Pagination from '../components/Pagination'
import ExportButton from '../components/ExportButton'

const redeemStatusStyles = {
  pending: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  completed: 'bg-green-50 text-green-600 border border-green-200',
}

export default function AdminRedeemVerification() {
  // ── Verify Panel state ──
  const [searchCode, setSearchCode] = useState('')
  const [searching, setSearching] = useState(false)
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')

  // ── Customer Transaction Log state ──
  const [txnLog, setTxnLog] = useState(null)
  const [txnLoading, setTxnLoading] = useState(false)

  // ── Redemption Logs state ──
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [redeemStatus, setRedeemStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // ── Fetch Redemption Logs ──
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.getRedemptionLogs({ page, limit: 10, redeemStatus, from, to })
      setLogs(data.logs)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, redeemStatus, from, to])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const resetPage = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  // ── Fetch customer transactions when lookup succeeds ──
  useEffect(() => {
    if (!lookupResult?.userId) {
      setTxnLog(null)
      return
    }
    let cancelled = false
    async function fetchTxns() {
      setTxnLoading(true)
      try {
        const data = await adminApi.getCustomerTransactions(lookupResult.userId)
        if (!cancelled) setTxnLog(data)
      } catch (err) {
        console.error('Failed to fetch customer transactions:', err)
        if (!cancelled) setTxnLog(null)
      } finally {
        if (!cancelled) setTxnLoading(false)
      }
    }
    fetchTxns()
    return () => { cancelled = true }
  }, [lookupResult?.userId])

  // ── Lookup Handler ──
  async function handleSearch(e) {
    e.preventDefault()
    const code = searchCode.trim()
    if (!code) return
    setSearching(true)
    setLookupError('')
    setLookupResult(null)
    setConfirmMsg('')
    try {
      const data = await adminApi.lookupRedeemCode(code)
      setLookupResult(data)
    } catch (err) {
      setLookupError(err.message)
    } finally {
      setSearching(false)
    }
  }

  // ── Confirm Handler ──
  async function handleConfirm() {
    if (!lookupResult || confirming) return
    setConfirming(true)
    setConfirmMsg('')
    try {
      await adminApi.confirmRedemption(lookupResult.ornamentId)
      setLookupResult((prev) => ({ ...prev, redeemStatus: 'completed' }))
      setConfirmMsg('Redemption confirmed successfully!')
      fetchLogs()
    } catch (err) {
      setConfirmMsg(err.message)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1a1a1a] text-2xl font-bold">Redeem Verification</h1>
        <p className="text-[#999] text-sm mt-1">Verify and confirm customer gold redemptions</p>
      </div>

      {/* ── Verify Panel ── */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <h2 className="text-[#1a1a1a] text-lg font-bold mb-4">Verify Redeem Code</h2>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder="Enter code (e.g. RDM-482913)"
            className="flex-1 bg-white border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm font-mono text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          />
          <button
            type="submit"
            disabled={searching || !searchCode.trim()}
            className="px-6 py-2.5 bg-[#6B1532] text-white rounded-lg text-sm font-semibold hover:bg-[#4A0E23] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Lookup Error */}
        {lookupError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">
            {lookupError}
          </div>
        )}

        {/* Lookup Result Card */}
        {lookupResult && (
          <div className="border border-[#E5E5E5] rounded-xl p-5 bg-[#FAFAFA]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Customer Name</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">{lookupResult.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Email</p>
                <p className="text-sm text-[#666]">{lookupResult.customer?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Phone</p>
                <p className="text-sm text-[#666]">{lookupResult.customer?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Ornament</p>
                <p className="text-sm text-[#666]">{lookupResult.ornamentName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Gold Redeemed</p>
                <p className="text-sm font-semibold text-[#D4AF37]">{lookupResult.goldRedeemed?.toFixed(4)}g</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Redeem Value</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">{'\u20B9'}{lookupResult.redeemValue?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Redeem Code</p>
                <p className="text-sm font-mono font-semibold text-[#D4AF37]">{lookupResult.redeemCode}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Status</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${redeemStatusStyles[lookupResult.redeemStatus] || ''}`}>
                  {lookupResult.redeemStatus}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Date</p>
                <p className="text-sm text-[#666]">{new Date(lookupResult.date).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Confirm Button */}
            {lookupResult.redeemStatus === 'pending' && (
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {confirming ? 'Confirming...' : 'Confirm Redemption'}
              </button>
            )}

            {/* Confirm Message */}
            {confirmMsg && (
              <p className={`mt-3 text-sm font-medium ${lookupResult.redeemStatus === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                {confirmMsg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Customer Transaction History ── */}
      {lookupResult && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
          <h2 className="text-[#1a1a1a] text-lg font-bold mb-4">Customer Transaction History</h2>

          {txnLoading && (
            <p className="text-sm text-[#999]">Loading transactions...</p>
          )}

          {!txnLoading && txnLog && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Member Since</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{new Date(txnLog.customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Total Invested</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{'\u20B9'}{txnLog.customer.totalInvested?.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Gold Balance</p>
                  <p className="text-sm font-semibold text-[#D4AF37]">{txnLog.customer.goldBalance?.toFixed(4)}g</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#999] mb-1">Transactions</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{txnLog.transactions.length}</p>
                </div>
              </div>

              {/* Transaction Table */}
              {txnLog.transactions.length === 0 ? (
                <p className="text-sm text-[#999]">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E5E5]">
                        <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-wider text-[#999] font-semibold">Date</th>
                        <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-wider text-[#999] font-semibold">Type</th>
                        <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-wider text-[#999] font-semibold">Gold (g)</th>
                        <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-wider text-[#999] font-semibold">Amount ({'\u20B9'})</th>
                        <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-wider text-[#999] font-semibold">Rate/g</th>
                        <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-wider text-[#999] font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txnLog.transactions.map((txn) => (
                        <tr key={txn._id} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors">
                          <td className="py-2.5 px-3 text-[#666] whitespace-nowrap">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${txn.type === 'buy' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-[#D4AF37]">{txn.grams?.toFixed(4)}</td>
                          <td className="py-2.5 px-3 text-right text-[#1a1a1a]">{'\u20B9'}{txn.amount?.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-[#666]">{'\u20B9'}{txn.pricePerGram?.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-[#666] max-w-[200px] truncate">{txn.description || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!txnLoading && !txnLog && (
            <p className="text-sm text-[#999]">Unable to load transaction history.</p>
          )}
        </div>
      )}

      {/* ── Redemption Logs Section ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#1a1a1a] text-lg font-bold">Redemption Logs</h2>
          <p className="text-[#999] text-sm mt-1"><span className="text-[#D4AF37] font-semibold">{total}</span> total redemptions</p>
        </div>
        <ExportButton
          label="Export CSV"
          onExport={() => exportCSV.redemptionLogs({ redeemStatus, from, to })}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            value={redeemStatus}
            onChange={(e) => resetPage(setRedeemStatus)(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
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
        <RedemptionLogsTable logs={logs} loading={loading} />
        <div className="px-4 pb-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
