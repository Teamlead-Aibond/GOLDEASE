import { useAuth } from '../../context/AuthContext'

export default function DashHeader({ onMenuToggle }) {
  const { user } = useAuth()
  const name = user?.name || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return (
    <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions, plans..."
            className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1a1a1a] placeholder:text-[#ccc] w-48 md:w-80 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile search icon */}
        <button className="sm:hidden p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-[10px] font-bold text-white rounded-full flex items-center justify-center">3</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-[#E5E5E5]">
          <div className="w-9 h-9 bg-[#6B1532] rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#1a1a1a]">{name}</p>
            <p className="text-xs text-[#999]">Gold Member</p>
          </div>
        </div>
      </div>
    </header>
  )
}
