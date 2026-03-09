import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAdminAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8F8] via-[#F8F8F8] to-[#6B1532]/5 flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6B1532]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-[#1a1a1a] font-bold text-lg">GoldEase</p>
            <p className="text-[#999] text-xs -mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#E5E5E5] rounded-2xl p-8 shadow-xl shadow-[#6B1532]/5">
          <h2 className="text-[#1a1a1a] text-xl font-bold mb-1">Welcome back</h2>
          <p className="text-[#999] text-sm mb-6">Sign in to the admin dashboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#666] text-xs font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@goldease.com"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#666] text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 pr-11 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#666] cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#6B1532] to-[#4A0E23] text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#ccc] text-xs mt-6">
          GoldEase Admin Panel &middot; Authorized access only
        </p>
      </div>
    </div>
  )
}
