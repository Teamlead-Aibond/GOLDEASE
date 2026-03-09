import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import Sidebar from '../components/Dashboard/Sidebar'
import DashHeader from '../components/Dashboard/DashHeader'
import GoldBalanceCard from '../components/Dashboard/GoldBalanceCard'
import LivePriceCard from '../components/Dashboard/LivePriceCard'
import QuickActions from '../components/Dashboard/QuickActions'
import PriceChart from '../components/Dashboard/PriceChart'
import RecentTransactions from '../components/Dashboard/RecentTransactions'
import BuyGoldModal from '../components/Dashboard/BuyGoldModal'
import RedeemModal from '../components/Dashboard/RedeemModal'
import RedeemCodeCard from '../components/Dashboard/RedeemCodeCard'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [portfolio, setPortfolio] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    api.getPortfolio().then(setPortfolio).catch(() => {})
  }, [refreshKey])

  const firstName = user?.name?.split(' ')[0] || 'User'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <DashHeader onMenuToggle={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              {greeting}, <span className="text-[#D4AF37]">{firstName}</span>
            </h2>
            <p className="text-sm text-[#999] mt-1">Here's your gold portfolio overview</p>
          </div>

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <GoldBalanceCard refreshKey={refreshKey} />
            <LivePriceCard />
            <QuickActions onBuyGold={() => setShowBuyModal(true)} onRedeem={() => setShowRedeemModal(true)} />
          </div>

          {/* Redeem Code */}
          {portfolio?.hasRedeemed && portfolio?.redeemCode && (
            <div className="mb-4 sm:mb-6">
              <RedeemCodeCard
                redeemCode={portfolio.redeemCode}
                ornamentName={portfolio.ornamentName}
                redeemStatus={portfolio.redeemStatus}
                redeemedAt={portfolio.redeemedAt}
              />
            </div>
          )}

          {/* Price Chart */}
          <div className="mb-4 sm:mb-6">
            <PriceChart />
          </div>

          {/* Recent Transactions */}
          <RecentTransactions refreshKey={refreshKey} />
        </main>
      </div>

      {/* Modals */}
      <BuyGoldModal open={showBuyModal} onClose={(didPurchase) => {
        setShowBuyModal(false)
        if (didPurchase) setRefreshKey((k) => k + 1)
      }} />
      <RedeemModal open={showRedeemModal} onClose={() => setShowRedeemModal(false)} />
    </div>
  )
}
