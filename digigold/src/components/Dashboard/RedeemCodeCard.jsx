import { useState } from 'react'

export default function RedeemCodeCard({ redeemCode, ornamentName, redeemStatus, redeemedAt }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(redeemCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formattedDate = redeemedAt
    ? new Date(redeemedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const isCompleted = redeemStatus === 'completed'

  return (
    <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[#666] text-sm font-medium">Redeem Code</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isCompleted
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Code display */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl sm:text-3xl font-bold text-[#6B1532] tracking-wider font-mono">
          {redeemCode}
        </span>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[#999] text-xs">Ornament</p>
          <p className="text-[#1a1a1a] font-semibold text-sm mt-0.5">{ornamentName}</p>
        </div>
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[#999] text-xs">Redeemed On</p>
          <p className="text-[#1a1a1a] font-semibold text-sm mt-0.5">{formattedDate}</p>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-[#888] flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Show this code at the store for verification
      </p>
    </div>
  )
}
