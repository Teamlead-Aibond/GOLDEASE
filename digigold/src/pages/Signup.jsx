import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    dob: '', gender: '', address: '', city: '', pincode: '',
    pan: '', aadhaar: '',
  })

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#6B1532] relative overflow-hidden flex-col justify-center px-16">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="animate-spin-coin" style={{ perspective: '400px' }}>
              <svg width="36" height="36" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="58" stroke="#D4AF37" strokeWidth="4" />
                <circle cx="60" cy="60" r="52" fill="#D4AF37" />
                <text x="60" y="70" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#6B1532" fontFamily="serif">₹</text>
              </svg>
            </div>
            <span className="text-[#D4AF37] text-2xl font-bold">GoldEase</span>
          </Link>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your
            <span className="text-[#D4AF37]"> gold investment </span>
            journey today
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Join thousands of smart investors building wealth through digital gold. Sign up in under 2 minutes.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              "Buy gold starting from just ₹100",
              "99.9% pure 24K gold, stored securely",
              "No hidden charges or lock-in period",
              "Redeem as jewellery or gold coins",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#6B1532]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="animate-spin-coin" style={{ perspective: '400px' }}>
                <svg width="32" height="32" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="58" stroke="#D4AF37" strokeWidth="4" />
                  <circle cx="60" cy="60" r="52" fill="#D4AF37" />
                  <text x="60" y="70" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#6B1532" fontFamily="serif">₹</text>
                </svg>
              </div>
              <span className="text-[#D4AF37] text-2xl font-bold">GoldEase</span>
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#D4AF37]' : 'text-[#ccc]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#6B1532] text-white' : 'bg-[#E5E5E5] text-[#999]'}`}>1</div>
              <span className="text-xs font-medium hidden sm:inline">Account</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-[#E5E5E5]'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#D4AF37]' : 'text-[#ccc]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#6B1532] text-white' : 'bg-[#E5E5E5] text-[#999]'}`}>2</div>
              <span className="text-xs font-medium hidden sm:inline">Personal</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-[#D4AF37]' : 'bg-[#E5E5E5]'}`} />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#D4AF37]' : 'text-[#ccc]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#6B1532] text-white' : 'bg-[#E5E5E5] text-[#999]'}`}>3</div>
              <span className="text-xs font-medium hidden sm:inline">KYC</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Step 1 - Account Details */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Create your account</h2>
              <p className="text-[#666] text-sm mb-8">Start investing in gold in under 2 minutes</p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2) }}>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Full Name</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input type="text" required value={form.name} onChange={update('name')} placeholder="Enter your full name" className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Email Address</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Phone Number</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input type="tel" required value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.password}
                      onChange={update('password')}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-12 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#6B1532] text-white font-semibold rounded-xl hover:bg-[#5a1129] transition-all cursor-pointer text-sm">
                  Continue
                </button>
              </form>
            </>
          )}

          {/* Step 2 - Personal Details */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Personal details</h2>
              <p className="text-[#666] text-sm mb-8">We need a few more details to set up your account</p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={update('dob')} className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Gender</label>
                  <select value={form.gender} onChange={update('gender')} className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:border-[#D4AF37] transition-colors bg-white">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Address</label>
                  <textarea value={form.address} onChange={update('address')} placeholder="Enter your full address" rows={3} className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none" />
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">City</label>
                    <input type="text" value={form.city} onChange={update('city')} placeholder="Chennai" className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Pincode</label>
                    <input type="text" value={form.pincode} onChange={update('pincode')} placeholder="600001" className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="w-full py-3 border border-[#E5E5E5] text-[#666] font-semibold rounded-xl hover:border-[#D4AF37] transition-all cursor-pointer text-sm">
                    Back
                  </button>
                  <button type="submit" className="w-full py-3 bg-[#6B1532] text-white font-semibold rounded-xl hover:bg-[#5a1129] transition-all cursor-pointer text-sm">
                    Continue
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3 - KYC */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">KYC Verification</h2>
              <p className="text-[#666] text-sm mb-8">Complete your KYC to start investing in gold</p>

              <form className="space-y-4" onSubmit={handleFinalSubmit}>
                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">PAN Card Number</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <input type="text" value={form.pan} onChange={update('pan')} placeholder="ABCDE1234F" className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors uppercase" />
                  </div>
                </div>

                {/* Aadhaar */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Aadhaar Number</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                    </svg>
                    <input type="text" value={form.aadhaar} onChange={update('aadhaar')} placeholder="1234 5678 9012" className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>

                {/* Upload PAN */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Upload PAN Card</label>
                  <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-6 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                    <svg className="w-8 h-8 text-[#ccc] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-[#999]">Click to upload or drag & drop</p>
                    <p className="text-xs text-[#ccc] mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" required className="w-4 h-4 accent-[#D4AF37] cursor-pointer mt-0.5" />
                  <label htmlFor="terms" className="text-xs text-[#666] cursor-pointer leading-relaxed">
                    I agree to the <a href="#" className="text-[#D4AF37]">Terms of Service</a>, <a href="#" className="text-[#D4AF37]">Privacy Policy</a>, and consent to digital KYC verification.
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="w-full py-3 border border-[#E5E5E5] text-[#666] font-semibold rounded-xl hover:border-[#D4AF37] transition-all cursor-pointer text-sm">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="w-full py-3 bg-[#6B1532] text-white font-semibold rounded-xl hover:bg-[#5a1129] transition-all cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? 'Creating account...' : 'Complete Signup'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-[#666] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D4AF37] font-semibold hover:text-[#B8960C] transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
