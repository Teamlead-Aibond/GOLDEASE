const actions = [
  {
    label: "Buy Gold",
    desc: "At live price",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600 bg-green-100",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Redeem",
    desc: "Get jewellery",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600 bg-purple-100",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
]

export default function QuickActions({ onBuyGold, onRedeem }) {
  const handlers = { 'Buy Gold': onBuyGold, 'Redeem': onRedeem }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-6">
      <p className="text-[#666] text-sm mb-4">Quick Actions</p>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={handlers[a.label]}
            className={`${a.color} border rounded-xl p-4 text-left hover:scale-[1.02] transition-transform cursor-pointer`}
          >
            <div className={`w-10 h-10 rounded-xl ${a.iconColor} flex items-center justify-center mb-2`}>
              {a.icon}
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a]">{a.label}</p>
            <p className="text-xs text-[#999] mt-0.5">{a.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
