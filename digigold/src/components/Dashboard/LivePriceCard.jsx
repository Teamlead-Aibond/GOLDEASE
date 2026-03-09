import useGoldPrice from '../../hooks/useGoldPrice'

export default function LivePriceCard() {
  const { goldPrice, loading } = useGoldPrice()

  const price24K = goldPrice ? goldPrice.price24K : 0
  const price22K = goldPrice ? goldPrice.price22K : 0
  const price18K = goldPrice ? goldPrice.price18K : 0
  const change = goldPrice ? goldPrice.change : 0
  const changePercent = goldPrice ? goldPrice.changePercent : 0
  const isUp = changePercent >= 0

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#666] text-sm">Live Gold Price</p>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full animate-pulse ${goldPrice ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-xs text-[#999]">{goldPrice ? (goldPrice.cached ? 'Cached' : 'Live') : 'Loading...'}</span>
        </div>
      </div>

      {loading && !goldPrice ? (
        <div className="py-4 text-center">
          <div className="w-8 h-8 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#999]">Fetching price...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold text-[#1a1a1a]">₹{price22K.toLocaleString()}</span>
            <span className="text-[#999] text-sm">/gram</span>
            <span className="text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">22K</span>
          </div>

          <div className="flex items-center gap-1.5 mb-6">
            <svg className={`w-4 h-4 ${isUp ? 'text-green-500' : 'text-red-500 rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className={`text-sm font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
              {isUp ? '+' : ''}₹{Math.round(change).toLocaleString()} ({isUp ? '+' : ''}{changePercent}%)
            </span>
            <span className="text-[#ccc] text-xs">today</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F5F5F5] rounded-xl p-3">
              <p className="text-[#999] text-xs">24K</p>
              <p className="text-[#1a1a1a] font-semibold text-sm">₹{price24K.toLocaleString()}/g</p>
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-3">
              <p className="text-[#999] text-xs">18K</p>
              <p className="text-[#1a1a1a] font-semibold text-sm">₹{price18K.toLocaleString()}/g</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
