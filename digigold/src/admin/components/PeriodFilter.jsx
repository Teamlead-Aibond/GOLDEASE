const periods = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
]

export default function PeriodFilter({ value, onChange }) {
  return (
    <div className="flex gap-1 bg-[#F5F5F5] rounded-xl p-1">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            value === p.value
              ? 'bg-[#6B1532] text-white shadow-sm'
              : 'text-[#666] hover:text-[#1a1a1a] hover:bg-white/60'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
