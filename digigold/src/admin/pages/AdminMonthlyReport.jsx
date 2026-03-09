import { useState, useEffect } from 'react'
import { adminApi } from '../utils/adminApi'
import { exportCSV } from '../utils/exportCSV'
import ExportButton from '../components/ExportButton'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function RevenueChart({
  title, days, maxRevenue, avgDaily, peakDay, activeDays,
  totalRevenue, totalPayments, monthName, chartYear, chartMonth,
  accentFrom, accentTo, barFrom, barTo, barHoverFrom, barHoverTo,
  peakText, avgBorder, headerGradient,
}) {
  const hasData = days.length > 0 && totalRevenue > 0

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm">
      <div className={`px-6 py-4 border-b border-[#E5E5E5] bg-gradient-to-r ${headerGradient} to-transparent rounded-t-2xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-[#1a1a1a] text-sm font-semibold">{title}</h3>
            <p className="text-[#1a1a1a] text-xs mt-0.5">{activeDays} active days &middot; {totalPayments} payments</p>
          </div>
          <p className="text-[#1a1a1a] text-lg font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {!hasData ? (
        <div className="p-6 text-center text-[#ccc] text-sm">No revenue data for {monthName}</div>
      ) : (
        <div className="p-4 sm:p-6">
          {/* Stats row */}
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-[#999] text-[10px] uppercase tracking-wider">Avg / Day</p>
              <p className="text-[#1a1a1a] text-sm font-bold">₹{avgDaily.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-px h-8 bg-[#E5E5E5]" />
            <div>
              <p className="text-[#999] text-[10px] uppercase tracking-wider">Peak</p>
              <p className={`${peakText} text-sm font-bold`}>{monthName.slice(0, 3)} {peakDay.day} &middot; ₹{peakDay.revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="flex gap-2">
            {/* Y-axis */}
            <div className="flex flex-col justify-between h-44 text-right pr-1 shrink-0">
              <span className="text-[#999] text-[10px]">₹{(maxRevenue / 1000).toFixed(0)}K</span>
              <span className="text-[#999] text-[10px]">₹{(maxRevenue / 2000).toFixed(0)}K</span>
              <span className="text-[#999] text-[10px]">₹0</span>
            </div>

            {/* Bars */}
            <div className="flex-1 relative overflow-visible">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-dashed border-[#E5E5E5]" />
                <div className="border-b border-dashed border-[#E5E5E5]" />
                <div className="border-b border-[#E5E5E5]" />
              </div>

              {/* Average line */}
              <div
                className={`absolute left-0 right-0 border-t-2 border-dashed ${avgBorder} z-10 pointer-events-none`}
                style={{ bottom: `${Math.min((avgDaily / maxRevenue) * 100, 95)}%` }}
              >
                <span className={`absolute -top-4 right-0 ${peakText} text-[9px] font-medium bg-white px-1`}>avg</span>
              </div>

              <div className="flex items-end gap-[2px] h-44 relative z-20">
                {days.map((d) => {
                  const isPeak = d.day === peakDay.day && d.revenue > 0
                  const dayHasData = d.revenue > 0
                  const barHeight = dayHasData ? Math.max((d.revenue / maxRevenue) * 170, 3) : 2
                  const dayOfWeek = new Date(chartYear, chartMonth - 1, d.day).getDay()
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer">
                      {/* Tooltip */}
                      {dayHasData && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-lg pointer-events-none">
                          <p className="font-semibold">{monthName.slice(0, 3)} {d.day}</p>
                          <p>₹{d.revenue.toLocaleString('en-IN')}</p>
                          <p className="text-white/60">{d.count} payment{d.count !== 1 ? 's' : ''}</p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`w-full rounded-t transition-all duration-200 ${
                          isPeak
                            ? `bg-gradient-to-t ${accentFrom} ${accentTo}`
                            : dayHasData
                              ? `bg-gradient-to-t ${barFrom} ${barTo} ${barHoverFrom} ${barHoverTo}`
                              : 'bg-[#F0F0F0]'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />

                      {/* Day label */}
                      <span className={`text-[7px] sm:text-[9px] leading-none h-3 flex items-center ${
                        isPeak ? `${peakText} font-bold` : isWeekend ? 'text-[#ccc]' : 'text-[#999]'
                      }`}>
                        {d.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#F0F0F0]">
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm bg-gradient-to-t ${accentFrom} ${accentTo}`} />
              <span className="text-[#999] text-[10px]">Peak day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm bg-gradient-to-t ${barFrom} ${barTo}`} />
              <span className="text-[#999] text-[10px]">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-6 border-t-2 border-dashed ${avgBorder}`} />
              <span className="text-[#999] text-[10px]">Avg</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminMonthlyReport() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [report, setReport] = useState(null)
  const [prevReport, setPrevReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Calculate previous month/year
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  useEffect(() => {
    async function fetchReport() {
      setLoading(true)
      setError('')
      try {
        const [data, prevData] = await Promise.all([
          adminApi.getMonthlyReport({ year, month }),
          adminApi.getMonthlyReport({ year: prevYear, month: prevMonth }).catch(() => null),
        ])
        setReport(data)
        setPrevReport(prevData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [year, month, prevYear, prevMonth])

  // Calculate totals from daily revenue
  const totalRevenue = report?.dailyRevenue?.reduce((sum, d) => sum + d.revenue, 0) || 0
  const totalPaymentCount = report?.dailyRevenue?.reduce((sum, d) => sum + d.count, 0) || 0

  // Build full month data (all days, including zeros)
  const daysInMonth = report ? new Date(year, month, 0).getDate() : 0
  const dailyMap = {}
  report?.dailyRevenue?.forEach((d) => { dailyMap[d._id] = d })
  const fullDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const data = dailyMap[day]
    return { day, revenue: data?.revenue || 0, count: data?.count || 0 }
  })
  const maxRevenue = Math.max(...fullDays.map((d) => d.revenue), 1)
  const activeDays = fullDays.filter((d) => d.revenue > 0).length
  const avgDaily = activeDays > 0 ? Math.round(totalRevenue / activeDays) : 0
  const peakDay = fullDays.reduce((best, d) => d.revenue > best.revenue ? d : best, fullDays[0] || { day: 0, revenue: 0 })

  // Previous month data
  const prevTotalRevenue = prevReport?.dailyRevenue?.reduce((sum, d) => sum + d.revenue, 0) || 0
  const prevTotalPaymentCount = prevReport?.dailyRevenue?.reduce((sum, d) => sum + d.count, 0) || 0
  const prevDaysInMonth = prevReport ? new Date(prevYear, prevMonth, 0).getDate() : 0
  const prevDailyMap = {}
  prevReport?.dailyRevenue?.forEach((d) => { prevDailyMap[d._id] = d })
  const prevFullDays = Array.from({ length: prevDaysInMonth }, (_, i) => {
    const day = i + 1
    const data = prevDailyMap[day]
    return { day, revenue: data?.revenue || 0, count: data?.count || 0 }
  })
  const prevMaxRevenue = prevFullDays.length > 0 ? Math.max(...prevFullDays.map((d) => d.revenue), 1) : 1
  const prevActiveDays = prevFullDays.filter((d) => d.revenue > 0).length
  const prevAvgDaily = prevActiveDays > 0 ? Math.round(prevTotalRevenue / prevActiveDays) : 0
  const prevPeakDay = prevFullDays.length > 0
    ? prevFullDays.reduce((best, d) => d.revenue > best.revenue ? d : best, prevFullDays[0])
    : { day: 0, revenue: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#1a1a1a] text-2xl font-bold">Monthly <span className="text-[#D4AF37]">Report</span></h1>
          <p className="text-[#999] text-sm mt-1">Analytics for {months[month - 1]} {year}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ExportButton
            label="Export"
            onExport={() => exportCSV.monthlyReport({ year, month })}
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <p className="text-[#999] text-xs font-medium mb-2">Total Revenue</p>
              <p className="text-[#D4AF37] text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[#ccc] text-xs mt-1">{totalPaymentCount} payments</p>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <p className="text-[#999] text-xs font-medium mb-2">New Customers</p>
              <p className="text-[#6B1532] text-3xl font-bold">{report.newCustomers}</p>
            </div>
          </div>

          {/* Daily Revenue Charts — Two separate graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Previous Month */}
            <RevenueChart
              title="Last Month"
              days={prevFullDays}
              maxRevenue={prevMaxRevenue}
              avgDaily={prevAvgDaily}
              peakDay={prevPeakDay}
              activeDays={prevActiveDays}
              totalRevenue={prevTotalRevenue}
              totalPayments={prevTotalPaymentCount}
              monthName={months[prevMonth - 1]}
              chartYear={prevYear}
              chartMonth={prevMonth}
              accentFrom="from-[#D4AF37]"
              accentTo="to-[#D4AF37]/60"
              barFrom="from-[#D4AF37]/50"
              barTo="to-[#D4AF37]/20"
              barHoverFrom="group-hover:from-[#D4AF37]/70"
              barHoverTo="group-hover:to-[#D4AF37]/40"
              peakText="text-[#D4AF37]"
              avgBorder="border-[#D4AF37]/40"
              headerGradient="from-[#D4AF37]/10"
            />

            {/* Current Month */}
            <RevenueChart
              title="This Month"
              days={fullDays}
              maxRevenue={maxRevenue}
              avgDaily={avgDaily}
              peakDay={peakDay}
              activeDays={activeDays}
              totalRevenue={totalRevenue}
              totalPayments={totalPaymentCount}
              monthName={months[month - 1]}
              chartYear={year}
              chartMonth={month}
              accentFrom="from-[#6B1532]"
              accentTo="to-[#6B1532]/70"
              barFrom="from-[#6B1532]/50"
              barTo="to-[#6B1532]/20"
              barHoverFrom="group-hover:from-[#6B1532]/70"
              barHoverTo="group-hover:to-[#6B1532]/40"
              peakText="text-[#6B1532]"
              avgBorder="border-[#6B1532]/40"
              headerGradient="from-[#6B1532]/5"
            />
          </div>

          {/* Payment Methods */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-gradient-to-r from-[#6B1532]/5 to-transparent rounded-t-2xl">
              <h3 className="text-[#1a1a1a] text-sm font-semibold">Payment Methods</h3>
            </div>
            {report.paymentMethods.length === 0 ? (
              <div className="p-6 text-center text-[#ccc] text-sm">No payment data</div>
            ) : (
              <div className="p-4 space-y-3">
                {report.paymentMethods.map((p) => (
                  <div key={p._id} className="flex items-center justify-between px-3 py-2.5 bg-[#FAFAFA] rounded-xl hover:bg-[#D4AF37]/5 transition-colors">
                    <div>
                      <p className="text-[#1a1a1a] text-sm font-medium capitalize">{p._id}</p>
                      <p className="text-[#ccc] text-xs">{p.count} payments</p>
                    </div>
                    <p className="text-[#D4AF37] text-sm font-medium">₹{p.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
