import { useState, useEffect } from 'react'
import { api } from '../../utils/api'
import useGoldPrice from '../../hooks/useGoldPrice'

const jewelleryItems = [
  { id: 1, name: 'Gold Coin',     weight: 1,   making: 250,  image: '/images/redeem_coin.jfif' },
  { id: 2, name: 'Gold Ring',     weight: 2,   making: 800,  image: '/images/redeem_ring.jpg' },
  { id: 3, name: 'Gold Pendant',  weight: 1.5, making: 600,  image: '/images/redeem_pendant.jpg' },
  { id: 4, name: 'Gold Chain',    weight: 5,   making: 2500, image: '/images/redeem_chain.png' },
  { id: 5, name: 'Gold Bracelet', weight: 3,   making: 1500, image: '/images/gold-bangles.jpg' },
  { id: 6, name: 'Gold Earrings', weight: 1.5, making: 700,  image: '/images/redeem_earring.jpg' },
]

export default function RedeemModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const [orderRef, setOrderRef] = useState('')
  const [portfolio, setPortfolio] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [redeemError, setRedeemError] = useState('')
  const { goldPrice } = useGoldPrice()

  useEffect(() => {
    if (open) {
      api.getPortfolio().then(setPortfolio).catch(() => {})
      setRedeemError('')
    }
  }, [open])

  const item = jewelleryItems.find((j) => j.id === selectedItem)

  function reset() {
    setStep(1)
    setSelectedItem(null)
    setOrderRef('')
    setRedeemError('')
    setSubmitting(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleConfirm() {
    if (!item || submitting) return
    setSubmitting(true)
    setRedeemError('')
    try {
      const response = await api.redeemGold({
        ornamentName: item.name,
        makingCharges: item.making,
        category: item.name.toLowerCase().includes('coin') ? 'coin'
          : item.name.toLowerCase().includes('ring') ? 'ring'
          : item.name.toLowerCase().includes('pendant') ? 'pendant'
          : item.name.toLowerCase().includes('chain') ? 'chain'
          : item.name.toLowerCase().includes('bracelet') ? 'bracelet'
          : item.name.toLowerCase().includes('earring') ? 'earring'
          : 'other',
      })
      setOrderRef(response.transaction.redeemCode)
      setStep(3)
    } catch (err) {
      setRedeemError(err.message || 'Redemption failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
          <h3 className="text-lg font-bold text-[#1C1917]">Redeem Gold</h3>
          <button onClick={handleClose} className="text-[#999] hover:text-[#333] transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-5 pt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s <= step ? 'bg-[#D4AF37] text-white' : 'bg-[#E5E5E5] text-[#999]'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 transition-colors ${s < step ? 'bg-[#D4AF37]' : 'bg-[#E5E5E5]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-5">
          {portfolio?.hasRedeemed ? (
            <AlreadyRedeemed onClose={handleClose} />
          ) : (
            <>
              {step === 1 && (
                <StepChooseJewellery
                  selected={selectedItem}
                  onSelect={setSelectedItem}
                  onContinue={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <StepConfirmOrder
                  item={item}
                  portfolio={portfolio}
                  goldPrice={goldPrice}
                  submitting={submitting}
                  redeemError={redeemError}
                  onBack={() => setStep(1)}
                  onConfirm={handleConfirm}
                />
              )}
              {step === 3 && (
                <StepSuccess item={item} portfolio={portfolio} orderRef={orderRef} onDone={handleClose} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Step 1: Choose Jewellery ─────────────────────────────── */
function StepChooseJewellery({ selected, onSelect, onContinue }) {
  return (
    <div>
      <p className="text-sm text-[#666] mb-4">Choose jewellery to redeem</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {jewelleryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`rounded-xl border text-left transition-all cursor-pointer overflow-hidden ${
              selected === item.id
                ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm ring-1 ring-[#D4AF37]'
                : 'border-[#E5E5E5] hover:border-[#D4AF37]'
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-28 object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-semibold text-[#1C1917]">{item.name}</p>
              <p className="text-xs text-[#D4AF37] font-medium mt-1">Making charges: ₹{item.making.toLocaleString('en-IN')}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={onContinue}
        className="w-full py-3 bg-[#D4AF37] text-white rounded-xl font-semibold transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}

/* ── Step 2: Confirm Order ────────────────────────────────── */
function StepConfirmOrder({ item, portfolio, goldPrice, submitting, redeemError, onBack, onConfirm }) {
  const goldBalance = portfolio?.goldBalance ?? 0
  const totalInvested = portfolio?.totalInvested ?? 0
  const todayRate = goldPrice ? Math.round(goldPrice.price22K) : 0
  const currentValue = Math.round(goldBalance * todayRate)
  const profit = currentValue - totalInvested
  const returnPct = totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(1) : '0.0'
  const showProfit = totalInvested > 0 && todayRate > 0

  return (
    <div>
      <p className="text-sm text-[#666] mb-4">Order Summary</p>

      {/* Investment Profit Card */}
      {showProfit && (
        <div className="bg-gradient-to-br from-[#6B1532] to-[#4A0E23] rounded-xl p-4 mb-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-white font-bold text-xs uppercase tracking-wider">Your Investment Advantage</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/10 rounded-lg p-2.5 text-center">
              <p className="text-white/70 text-[10px] uppercase tracking-wider mb-0.5">You Invested</p>
              <p className="text-sm font-bold">₹{totalInvested.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2.5 text-center">
              <p className="text-white/70 text-[10px] uppercase tracking-wider mb-0.5">Today's Value</p>
              <p className="text-sm font-bold text-[#D4AF37]">₹{currentValue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[10px] uppercase tracking-wider">
                {profit >= 0 ? 'Your Profit' : 'Current Loss'}
              </p>
              <p className={`text-base font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}₹{Math.abs(profit).toLocaleString('en-IN')}
              </p>
            </div>
            <div className={`${profit >= 0 ? 'bg-green-500/20 border-green-400/30' : 'bg-red-500/20 border-red-400/30'} border rounded-full px-3 py-1`}>
              <span className={`text-sm font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}{returnPct}%
              </span>
            </div>
          </div>

          <p className="text-white/50 text-[10px] mt-2 text-center">
            If you bought {goldBalance.toFixed(2)}g gold today, it would cost ₹{currentValue.toLocaleString('en-IN')} — you saved ₹{Math.abs(profit).toLocaleString('en-IN')}!
          </p>
        </div>
      )}

      {/* Item card */}
      <div className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl mb-4">
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
        <div>
          <p className="font-semibold text-[#1C1917]">{item.name}</p>
          <p className="text-sm text-[#D4AF37] font-medium">Making charges: ₹{item.making.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Jewellery</span>
          <span className="font-semibold text-[#1C1917]">{item.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Gold to Redeem</span>
          <span className="font-semibold text-[#D4AF37]">{goldBalance.toFixed(4)}g (entire balance)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Gold Value</span>
          <span className="font-semibold text-[#1C1917]">₹{currentValue.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Making Charges</span>
          <span className="font-semibold text-[#1C1917]">₹{item.making.toLocaleString('en-IN')}</span>
        </div>
        <div className="border-t border-[#E5E5E5] pt-3">
          <p className="text-xs text-[#999]">Your entire gold balance will be redeemed. Making charges will be deducted from your wallet or paid separately at the time of delivery.</p>
        </div>
      </div>

      {/* Address placeholder */}
      <div className="p-3 border border-dashed border-[#D4AF37]/50 rounded-xl mb-6 bg-[#E5D3A3/20]">
        <p className="text-xs text-[#999] mb-0.5">Delivery Address</p>
        <p className="text-sm text-[#1C1917]">123 Main Street, Mumbai, Maharashtra 400001</p>
      </div>

      {redeemError && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{redeemError}</div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-3 border border-[#E5E5E5] text-[#666] rounded-xl font-semibold hover:bg-[#F5F5F5] transition-colors cursor-pointer disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="flex-1 py-3 bg-[#D4AF37] text-white rounded-xl font-semibold cursor-pointer hover:bg-[#B8960C] transition-colors disabled:opacity-60"
        >
          {submitting ? 'Processing...' : 'Confirm Redemption'}
        </button>
      </div>
    </div>
  )
}

/* ── Already Redeemed ─────────────────────────────────────── */
function AlreadyRedeemed({ onClose }) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </div>

      <h4 className="text-xl font-bold text-[#1C1917] mb-2">Already Redeemed</h4>
      <p className="text-sm text-[#666] mb-1">
        You have already redeemed your gold from this scheme.
      </p>
      <p className="text-sm text-[#D4AF37] font-semibold mb-6">
        Please join the scheme again to start a new plan and redeem again!
      </p>

      <button
        onClick={onClose}
        className="w-full py-3 bg-[#D4AF37] text-white rounded-xl font-semibold cursor-pointer hover:bg-[#B8960C] transition-colors"
      >
        Got it
      </button>
    </div>
  )
}

/* ── Step 3: Success ──────────────────────────────────────── */
function StepSuccess({ item, portfolio, orderRef, onDone }) {
  const goldBalance = portfolio?.goldBalance ?? 0

  return (
    <div className="text-center py-4">
      {/* Animated checkmark */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h4 className="text-xl font-bold text-[#1C1917] mb-1">Order Placed!</h4>
      <p className="text-sm text-[#999] mb-6">Your {item.name} is on its way</p>

      {/* Summary */}
      <div className="bg-[#F5F5F5] rounded-xl p-4 text-left space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Item</span>
          <span className="font-semibold text-[#1C1917]">{item.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Gold Redeemed</span>
          <span className="font-semibold text-[#D4AF37]">{goldBalance.toFixed(4)}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Making Charges</span>
          <span className="font-semibold text-[#1C1917]">₹{item.making.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Redeem Code</span>
          <span className="font-semibold text-[#D4AF37] font-mono">{orderRef}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Estimated Delivery</span>
          <span className="font-semibold text-[#1C1917]">5-7 business days</span>
        </div>
      </div>

      <p className="text-xs text-[#999] mb-4">Keep your redeem code safe — you will need it for verification at the store.</p>

      <button
        onClick={onDone}
        className="w-full py-3 bg-[#D4AF37] text-white rounded-xl font-semibold cursor-pointer hover:bg-[#B8960C] transition-colors"
      >
        Done
      </button>
    </div>
  )
}
