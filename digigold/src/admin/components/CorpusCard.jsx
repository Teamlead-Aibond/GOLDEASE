export default function CorpusCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 animate-pulse shadow-sm">
        <div className="h-4 bg-[#E5E5E5] rounded w-1/3 mb-4" />
        <div className="h-9 bg-[#E5E5E5] rounded w-1/2 mb-4" />
        <div className="flex gap-6">
          <div className="h-4 bg-[#E5E5E5] rounded w-1/4" />
          <div className="h-4 bg-[#E5E5E5] rounded w-1/4" />
        </div>
      </div>
    )
  }

  const corpus = data || { balance: 0, totalInvested: 0, totalRedeemed: 0 }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span className="text-[#1a1a1a] text-sm font-medium">Corpus Balance</span>
      </div>
      <p className="text-[#6B1532] text-3xl font-bold mb-4">
        ₹{corpus.balance.toLocaleString('en-IN')}
      </p>
      <div className="flex gap-6 text-sm">
        <div>
          <span className="text-[#999] text-xs">Total Invested</span>
          <p className="text-[#1a1a1a] font-medium">₹{corpus.totalInvested.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <span className="text-[#999] text-xs">Total Redeemed</span>
          <p className="text-[#1a1a1a] font-medium">₹{corpus.totalRedeemed.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}
