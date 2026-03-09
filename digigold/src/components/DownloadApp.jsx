export default function DownloadApp() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#6B1532] via-[#7D1A3C] to-[#6B1532] rounded-3xl overflow-hidden">

          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 sm:p-12 lg:p-16">

            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                <span className="text-[#D4AF37] text-sm font-medium">Available on iOS & Android</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Download the
                <span className="text-[#D4AF37]"> GoldEase </span>
                App Today
              </h2>

              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
                Invest in gold on the go. Track prices, buy gold instantly, redeem jewellery — all from your phone.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {["Live Gold Prices", "Instant Buy Gold", "Redeem Jewellery", "Secure Vault Storage"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Google Play */}
                <a href="#" className="flex items-center gap-3 bg-black px-6 py-3 rounded-xl hover:bg-black/80 transition-all hover:scale-105 group">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.092 12l2.606-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-wider">Get it on</p>
                    <p className="text-white font-semibold text-base -mt-0.5">Google Play</p>
                  </div>
                </a>

                {/* App Store */}
                <a href="#" className="flex items-center gap-3 bg-black px-6 py-3 rounded-xl hover:bg-black/80 transition-all hover:scale-105 group">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-wider">Download on the</p>
                    <p className="text-white font-semibold text-base -mt-0.5">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-3xl scale-75" />

                {/* Phone Frame */}
                <div className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl border border-white/10">
                  <div className="bg-white rounded-[2.5rem] w-[280px] h-[560px] overflow-hidden">

                    {/* Status Bar */}
                    <div className="bg-[#6B1532] px-6 pt-4 pb-3 flex items-center justify-between">
                      <span className="text-white text-xs">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-white/60 rounded-sm" />
                        <div className="w-4 h-2 bg-white/60 rounded-sm" />
                        <div className="w-6 h-2 bg-white rounded-sm" />
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="bg-[#6B1532] px-6 pb-5">
                      <p className="text-[#D4AF37] font-bold text-lg">GoldEase</p>
                      <p className="text-white/60 text-xs">Welcome, Priya!</p>
                    </div>

                    {/* Gold Balance Card */}
                    <div className="px-4 -mt-3">
                      <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8960C] rounded-2xl p-4 shadow-lg">
                        <p className="text-white/80 text-xs">Your Gold Balance</p>
                        <p className="text-white text-2xl font-bold mt-1">10.245 grams</p>
                        <p className="text-white/70 text-xs mt-1">Worth ₹61,470</p>
                      </div>
                    </div>

                    {/* Live Price */}
                    <div className="px-4 mt-4">
                      <div className="bg-[#FAFAFA] rounded-xl p-3 border border-[#E5E5E5]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#999] text-[10px]">24K Gold Rate</p>
                            <p className="text-[#1a1a1a] font-bold">₹6,000/g</p>
                          </div>
                          <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-lg">+1.2%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 mt-4 grid grid-cols-3 gap-2">
                      {[
                        { label: "Buy", color: "bg-[#6B1532]" },
                        { label: "Redeem", color: "bg-[#D4AF37]" },
                      ].map((btn) => (
                        <div key={btn.label} className={`${btn.color} rounded-xl py-2.5 text-center`}>
                          <p className="text-white text-xs font-semibold">{btn.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Transactions */}
                    <div className="px-4 mt-4">
                      <p className="text-[#1a1a1a] text-xs font-semibold mb-2">Recent</p>
                      {[
                        { type: "Bought", amount: "₹5,000", grams: "+0.83g", color: "text-green-600" },
                        { type: "Redeemed", amount: "Pendant", grams: "-1.00g", color: "text-purple-500" },
                      ].map((tx) => (
                        <div key={tx.type} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                          <div>
                            <p className="text-[#1a1a1a] text-xs font-medium">{tx.type}</p>
                            <p className="text-[#999] text-[10px]">{tx.amount}</p>
                          </div>
                          <span className={`${tx.color} text-xs font-semibold`}>{tx.grams}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
