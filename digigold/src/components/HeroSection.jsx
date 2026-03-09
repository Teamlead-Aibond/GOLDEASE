import useGoldPrice from '../hooks/useGoldPrice'

export default function HeroSection() {
  const { goldPrice } = useGoldPrice()

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFF9F0] to-white" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6B1532]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#D4AF37]/8 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left - Text Content */}
          <div className="text-center lg:text-left pt-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B1532]/10 border border-[#6B1532]/20 rounded-full mb-8">
              <span className={`w-2 h-2 rounded-full animate-pulse ${goldPrice ? 'bg-green-500' : 'bg-[#D4AF37]'}`} />
              <span className="text-[#6B1532] text-sm font-medium">
                Live Gold Price (22K): ₹{goldPrice ? goldPrice.price22K.toLocaleString() : '---'}/gram
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <span className="text-[#1a1a1a]">Invest Securely </span>
              <br />
              <span className="text-[#1a1a1a]">in </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8960C]">
                Digital Gold
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[#666] text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Start saving in gold with as little as <span className="text-[#D4AF37] font-semibold">₹100</span>.
              Buy, save, and redeem 24K pure gold anytime, anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#6B1532] text-white font-bold rounded-xl hover:bg-[#551228] transition-all hover:scale-105 text-lg cursor-pointer shadow-lg shadow-[#6B1532]/20">
                Start Investing
              </button>
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all text-lg cursor-pointer">
                See How It Works
              </button>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-8 mt-14 pt-8 border-t border-[#E5E5E5] max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#6B1532]">10K+</p>
                <p className="text-[#999] text-sm mt-1">Users</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">₹50Cr+</p>
                <p className="text-[#999] text-sm mt-1">Gold Traded</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#6B1532]">99.9%</p>
                <p className="text-[#999] text-sm mt-1">Pure Gold</p>
              </div>
            </div>
          </div>

          {/* Right - Bangles Image */}
          <div className="hidden lg:flex justify-center relative">

            {/* Glow effect behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#D4AF37]/15 rounded-full blur-3xl" />

            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D4AF37]/20 border-2 border-[#D4AF37]/20">
                <img
                  src="/images/bangles.jpg"
                  alt="Gold Bangles"
                  className="w-full max-w-[500px] h-[500px] object-cover"
                />
              </div>

            </div>
          </div>

          {/* Mobile Image */}
          <div className="lg:hidden relative mx-auto max-w-md w-full">
            <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-3xl scale-75" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D4AF37]/20 border-2 border-[#D4AF37]/20">
              <img
                src="/images/bangles.jpg"
                alt="Gold Bangles"
                className="w-full h-[220px] object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
