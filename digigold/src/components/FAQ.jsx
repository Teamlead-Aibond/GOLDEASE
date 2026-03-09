import { useState } from 'react'

const faqs = [
  {
    question: "What is Digital Gold?",
    answer: "Digital Gold allows you to buy and store 24K pure gold online. The gold you purchase is stored securely in insured vaults by our trusted partners. You can redeem it as physical gold or jewellery anytime.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    question: "What is the minimum amount to buy gold?",
    answer: "You can start buying gold with as little as ₹100 or 0.001 grams. There is no upper limit — invest as much as you want based on your financial goals.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    question: "Is my gold safe and insured?",
    answer: "Absolutely. Your gold is stored in bank-grade insured vaults managed by our custodian partners. Every gram is backed by 99.9% pure 24K physical gold and is fully insured against theft and damage.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    question: "Can I convert digital gold to jewellery?",
    answer: "Yes! You can redeem your digital gold for stunning jewellery or gold coins from our catalogue. The jewellery is crafted by trusted partners and delivered free to your doorstep with purity certification.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    question: "What KYC documents are required?",
    answer: "You need a valid PAN card and Aadhaar card for KYC verification. The process is fully digital and takes less than 2 minutes to complete.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
      </svg>
    ),
  },
  {
    question: "Are there any hidden charges?",
    answer: "No hidden charges. We maintain full transparency — you only pay the live gold rate plus a small 3% GST as per government regulations. There are no storage fees, no maintenance charges, and no exit fees.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
      </svg>
    ),
  },
]

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white shadow-lg shadow-[#6B1532]/5 border border-[#D4AF37]/30' : 'bg-white/60 border border-[#E5E5E5] hover:border-[#D4AF37]/20 hover:shadow-md'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left cursor-pointer"
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#6B1532] text-white' : 'bg-[#6B1532]/10 text-[#6B1532]'}`}>
          {faq.icon}
        </div>

        {/* Question */}
        <span className={`font-semibold text-sm sm:text-base flex-1 pr-2 transition-colors ${isOpen ? 'text-[#6B1532]' : 'text-[#1a1a1a]'}`}>
          {faq.question}
        </span>

        {/* Toggle */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#D4AF37] rotate-180' : 'bg-[#F0F0F0]'}`}>
          <svg
            className={`w-4 h-4 transition-colors ${isOpen ? 'text-white' : 'text-[#666]'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Answer with smooth expand */}
      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 pl-[4.5rem]">
            <p className="text-[#666] text-sm leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FFF9F0] via-[#FFF5E6] to-[#FFF9F0] relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-10 right-0 w-[350px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-[250px] h-[250px] bg-[#6B1532]/5 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B1532]/10 border border-[#6B1532]/20 rounded-full mb-4">
            <svg className="w-4 h-4 text-[#6B1532]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#6B1532] text-sm font-semibold">Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-[#666] mt-3">
            Everything you need to know about investing in digital gold.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} faq={faq} index={index} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="text-center mt-14 relative">
          <div className="bg-gradient-to-br from-[#6B1532] to-[#4A0E22] rounded-3xl p-8 sm:p-10 overflow-hidden relative">
            {/* Decorative */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-white font-bold text-xl mb-2">Still have questions?</p>
              <p className="text-white/50 text-sm mb-6">Our support team is available 24/7 to help you.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="mailto:support@goldease.in" className="w-full sm:w-auto px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#c4a032] transition-all hover:scale-105 cursor-pointer text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Support
                </a>
                <a href="tel:18001234567" className="w-full sm:w-auto px-6 py-3 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all cursor-pointer text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 1800-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
