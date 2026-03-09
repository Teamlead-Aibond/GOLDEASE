import useGoldPrice from '../hooks/useGoldPrice'

export default function GoldPriceSection() {
  const { goldPrice, loading, error, refetch } = useGoldPrice()

  const goldRates = goldPrice
    ? [
        { karat: "24K", buyPrice: goldPrice.price24K, change: goldPrice.changePercent },
        { karat: "22K", buyPrice: goldPrice.price22K, change: (goldPrice.changePercent * 0.92).toFixed(2) },
        { karat: "18K", buyPrice: goldPrice.price18K, change: (goldPrice.changePercent * 0.85).toFixed(2) },
      ]
    : [
        { karat: "24K", buyPrice: 0, change: 0 },
        { karat: "22K", buyPrice: 0, change: 0 },
        { karat: "18K", buyPrice: 0, change: 0 },
      ]

  return (
    <section id="gold-price" className="py-20 bg-[#FFF9F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Live Rates</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-2">
            Today's Gold Price
          </h2>
          <p className="text-[#666] mt-3 max-w-xl mx-auto">
            Real-time gold prices updated every 10 minutes. Buy gold at the best rates.
          </p>
        </div>

        {/* Loading State */}
        {loading && !goldPrice && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#999]">Fetching live gold prices...</p>
          </div>
        )}

        {/* Error State */}
        {error && !goldPrice && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-3">{error}</p>
            <button onClick={refetch} className="px-4 py-2 bg-[#6B1532] text-white rounded-lg text-sm cursor-pointer hover:bg-[#551228]">
              Retry
            </button>
          </div>
        )}

        {/* Price Cards */}
        {(goldPrice || !loading) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {goldRates.map((rate) => {
              const isUp = rate.change >= 0
              return (
                <div
                  key={rate.karat}
                  className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg hover:border-[#D4AF37]/30 transition-all"
                >
                  {/* Karat Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#6B1532] text-white text-sm font-bold rounded-lg">
                      {rate.karat}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                      <svg className={`w-4 h-4 ${isUp ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {isUp ? '+' : ''}{rate.change}%
                    </span>
                  </div>

                  {/* Buy Price */}
                  <div className="mb-4">
                    <p className="text-xs text-[#999] uppercase tracking-wider mb-1">Buy Price</p>
                    <p className="text-3xl font-bold text-[#1a1a1a]">
                      ₹{rate.buyPrice.toLocaleString()}
                      <span className="text-sm font-normal text-[#999]"> /gram</span>
                    </p>
                  </div>

                  {/* Buy Button */}
                  <button className="w-full mt-6 px-4 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#c4a032] transition-all cursor-pointer">
                    Buy {rate.karat} Gold
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-[#999] text-sm flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${goldPrice ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            {goldPrice
              ? `Last updated: ${new Date(goldPrice.lastUpdated).toLocaleTimeString()} IST ${goldPrice.cached ? '(cached)' : '(live)'}`
              : 'Waiting for price data...'
            }
          </p>
        </div>
      </div>
    </section>
  )
}
