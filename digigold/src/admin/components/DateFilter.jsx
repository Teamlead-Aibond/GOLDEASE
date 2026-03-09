export default function DateFilter({ from, to, onFromChange, onToChange, onClear }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-[#999] text-xs">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-[#999] text-xs">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
        />
      </div>
      {(from || to) && (
        <button
          onClick={onClear}
          className="text-xs text-red-500 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  )
}
