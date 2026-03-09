export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
      <p className="text-[#999] text-xs font-medium">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs rounded-xl border border-[#E5E5E5] text-[#666] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-xs rounded-xl border border-[#E5E5E5] text-[#666] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}
