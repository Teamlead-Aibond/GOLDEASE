const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up in under 2 minutes with your PAN & Aadhaar. Quick KYC verification gets you started instantly.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Add Money",
    description: "Add funds to your wallet using UPI, Net Banking, or Debit Card. Start with as little as ₹100.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Buy Digital Gold",
    description: "Purchase 24K pure gold at live market rates. Buy in grams or by rupee amount — your choice.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Redeem as Jewellery",
    description: "Redeem your digital gold for stunning jewellery or gold coins delivered to your doorstep.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-2">
            How It Works
          </h2>
          <p className="text-[#666] mt-3 max-w-xl mx-auto">
            Start your gold investment journey in just 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-[2px] bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/10" />
              )}

              {/* Card */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all relative z-10">

                {/* Step Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 bg-[#6B1532] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-extrabold text-[#6B1532] group-hover:text-[#D4AF37] transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{step.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <button className="px-8 py-4 bg-[#6B1532] text-white font-bold rounded-xl hover:bg-[#551228] transition-all hover:scale-105 text-lg cursor-pointer shadow-lg shadow-[#6B1532]/20">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  )
}
