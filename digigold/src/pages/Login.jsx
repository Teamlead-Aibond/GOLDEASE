import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
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
            Welcome back to your
            <span className="text-[#D4AF37]"> gold journey</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Track your investments, buy gold, and manage your portfolio — all in one place.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">10K+</p>
              <p className="text-white/40 text-sm">Active Investors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">₹50Cr+</p>
              <p className="text-white/40 text-sm">Gold Traded</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">99.9%</p>
              <p className="text-white/40 text-sm">Pure Gold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
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

          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Login to your account</h2>
          <p className="text-[#666] text-sm mb-8">Enter your credentials to access your gold portfolio</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Email Address</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#1a1a1a]">Password</label>
                <a href="#" className="text-xs text-[#D4AF37] hover:text-[#B8960C] transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-[#D4AF37] cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-[#666] cursor-pointer">Remember me for 30 days</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6B1532] text-white font-semibold rounded-xl hover:bg-[#5a1129] transition-all cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[#666] mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#D4AF37] font-semibold hover:text-[#B8960C] transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
