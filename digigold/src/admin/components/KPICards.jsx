const kpiConfig = [
  {
    key: 'totalCustomers',
    label: 'Total Customers',
    format: (v) => v.toLocaleString('en-IN'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    iconBg: 'bg-[#6B1532]/10',
    iconColor: 'text-[#6B1532]',
    valueColor: 'text-[#6B1532]',
  },
  {
    key: 'customersToday',
    label: 'Joined Today',
    format: (v) => v.toLocaleString('en-IN'),
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    iconBg: 'bg-[#D4AF37]/10',
    iconColor: 'text-[#D4AF37]',
    valueColor: 'text-[#D4AF37]',
  },
]

export default function KPICards({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-[#E5E5E5]">
            <div className="h-4 bg-[#E5E5E5] rounded w-2/3 mb-3" />
            <div className="h-7 bg-[#E5E5E5] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {kpiConfig.map((kpi) => (
        <div
          key={kpi.key}
          className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#555] text-sm font-medium">{kpi.label}</span>
            <div className={`w-10 h-10 ${kpi.iconBg} rounded-lg flex items-center justify-center ${kpi.iconColor}`}>
              {kpi.icon}
            </div>
          </div>
          <p className={`${kpi.valueColor} text-3xl font-bold`}>
            {data ? kpi.format(data[kpi.key]) : '—'}
          </p>
        </div>
      ))}
    </div>
  )
}
