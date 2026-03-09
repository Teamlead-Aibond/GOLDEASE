import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#F5F5F5] to-[#F3EDE0]/30">
      {/* Decorative blur circles */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#6B1532]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#6B1532] to-[#4A0E23] border-b border-white/10 shadow-lg">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white/60 hover:text-white p-1 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="animate-spin-coin" style={{ perspective: '400px' }}>
              <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="58" stroke="#D4AF37" strokeWidth="4" />
                <circle cx="60" cy="60" r="52" fill="#D4AF37" />
                <text x="60" y="70" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#6B1532" fontFamily="serif">₹</text>
              </svg>
            </div>
            <span className="text-[#D4AF37] font-bold text-sm">GoldEase Admin</span>
          </div>
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
