import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-[#6B1532] z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ perspective: '400px' }}>
            <div className="animate-spin-coin">
              <svg width="32" height="32" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="58" stroke="url(#navGoldGrad)" strokeWidth="4" />
                <circle cx="60" cy="60" r="52" fill="url(#navCoinFace)" />
                <circle cx="60" cy="60" r="44" stroke="#B8960C" strokeWidth="1.5" fill="none" />
                <text x="60" y="70" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#6B1532" fontFamily="serif">₹</text>
                <defs>
                  <linearGradient id="navGoldGrad" x1="0" y1="0" x2="120" y2="120">
                    <stop offset="0%" stopColor="#F5D061" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B8960C" />
                  </linearGradient>
                  <radialGradient id="navCoinFace" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#F5E6A3" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#A67C00" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <span className="text-[#D4AF37] text-2xl font-bold">GoldEase</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-white hover:text-[#D4AF37] transition-colors text-sm font-medium">Home</a>
            <a href="#how-it-works" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm font-medium">How It Works</a>
            <a href="#features" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm font-medium">Features</a>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm text-white border border-white/30 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 text-sm text-[#6B1532] bg-[#D4AF37] rounded-lg hover:bg-[#c4a032] transition-colors font-semibold">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#6B1532] border-t border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            <a href="#home" className="text-white hover:text-[#D4AF37] transition-colors text-sm py-2">Home</a>
            <a href="#how-it-works" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm py-2">How It Works</a>
            <a href="#features" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm py-2">Features</a>
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 px-4 py-2 text-sm text-white border border-white/30 rounded-lg hover:border-[#D4AF37] transition-colors text-center">
                Login
              </Link>
              <Link to="/signup" className="flex-1 px-4 py-2 text-sm text-[#6B1532] bg-[#D4AF37] rounded-lg hover:bg-[#c4a032] transition-colors font-semibold text-center">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
