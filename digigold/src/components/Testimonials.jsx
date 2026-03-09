const testimonials = [
  {
    name: "Priya Sharma",
    location: "Chennai",
    role: "Homemaker",
    rating: 5,
    text: "I started with just ₹500 per month on GoldEase. In one year, I've saved over 10 grams! The process is so simple that even my mother uses it now.",
    avatar: "PS",
    goldSaved: "10.2g",
    featured: true,
  },
  {
    name: "Rajesh Kumar",
    location: "Madurai",
    role: "Software Engineer",
    rating: 5,
    text: "GoldEase made gold investment effortless for me. I love the instant buy feature — I purchased gold at the perfect price during a dip. Highly recommended!",
    avatar: "RK",
    goldSaved: "25.5g",
  },
  {
    name: "Anitha Venkatesh",
    location: "Coimbatore",
    role: "Business Owner",
    rating: 4,
    text: "I redeemed my digital gold for a beautiful necklace for my daughter's wedding. The jewellery quality was outstanding and delivery was on time.",
    avatar: "AV",
    goldSaved: "42.0g",
  },
  {
    name: "Mohammed Farhan",
    location: "Trichy",
    role: "Teacher",
    rating: 5,
    text: "What I love most is the transparency. I can see live gold prices and my portfolio value anytime. It feels safe and trustworthy. Best gold app!",
    avatar: "MF",
    goldSaved: "8.7g",
  },
  {
    name: "Deepika Rajan",
    location: "Bangalore",
    role: "Doctor",
    rating: 5,
    text: "I gifted digital gold to my parents on their anniversary. They were thrilled! Such a thoughtful and modern way to give gold. Love this feature.",
    avatar: "DR",
    goldSaved: "15.3g",
  },
  {
    name: "Suresh Babu",
    location: "Salem",
    role: "Retired Banker",
    rating: 4,
    text: "As a retired banker, I'm very particular about security. GoldEase's RBI compliance and vault insurance gave me full confidence to invest.",
    avatar: "SB",
    goldSaved: "55.0g",
  },
]

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-[#D4AF37]' : 'text-[#E5E5E5]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const featured = testimonials.find((t) => t.featured)
  const others = testimonials.filter((t) => !t.featured)

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#FFF9F0] to-white relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-[300px] h-[300px] bg-[#6B1532]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-2">
            Loved by Thousands
          </h2>
          <p className="text-[#666] mt-3 max-w-xl mx-auto">
            Hear from our happy investors who are building their gold savings every day.
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[#1a1a1a] font-bold text-lg">4.8</span>
            <span className="text-[#999] text-sm">from 2,500+ reviews</span>
          </div>
        </div>

        {/* Featured Testimonial */}
        {featured && (
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#6B1532] to-[#4A0E22] rounded-3xl p-8 sm:p-10 text-white overflow-hidden">

              {/* Decorative quote */}
              <svg className="absolute top-4 right-6 w-24 h-24 text-white/5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
              </svg>

              {/* Gold accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent" />

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {featured.avatar}
                  </div>
                </div>

                <div className="flex-1">
                  <StarRating count={featured.rating} />
                  <p className="text-white/90 text-lg leading-relaxed mt-4 mb-6">"{featured.text}"</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">{featured.name}</p>
                      <p className="text-white/50 text-sm">{featured.role}, {featured.location}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <div>
                        <p className="text-[#D4AF37] text-xs font-medium">Gold Saved</p>
                        <p className="text-white font-bold">{featured.goldSaved}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {others.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#D4AF37]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${
                i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Top gold accent on hover */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header - Avatar + Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6B1532] to-[#4A0E22] rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1a1a1a]">{t.name}</p>
                  <p className="text-xs text-[#999]">{t.role}, {t.location}</p>
                </div>
                <div className="text-right bg-[#D4AF37]/10 rounded-lg px-3 py-1.5">
                  <p className="text-[10px] text-[#999] uppercase tracking-wider">Saved</p>
                  <p className="text-sm font-bold text-[#D4AF37]">{t.goldSaved}</p>
                </div>
              </div>

              {/* Rating */}
              <StarRating count={t.rating} />

              {/* Review Text */}
              <p className="text-[#444] text-sm leading-relaxed mt-3">"{t.text}"</p>

              {/* Verified badge */}
              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-[#F0F0F0]">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-xs text-[#999]">Verified Investor</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#6B1532] via-[#7D1A3C] to-[#6B1532] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">Ready to start your gold journey?</h3>
            <p className="text-white/60 mt-2">Join 10,000+ investors saving in digital gold every day.</p>
          </div>
          <button className="relative z-10 w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#c4a032] transition-all hover:scale-105 text-lg cursor-pointer shrink-0 shadow-lg shadow-[#D4AF37]/20">
            Start Investing Free
          </button>
        </div>
      </div>
    </section>
  )
}
