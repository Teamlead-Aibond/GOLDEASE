import { useState } from 'react'
import useGoldPrice from '../../hooks/useGoldPrice'
import { api } from '../../utils/api'

const FALLBACK_PRICES = { '24K': 7650, '22K': 7013 } // fallback if API unavailable

const paymentMethods = [
  {
    id: 'upi',
    label: 'UPI',
    desc: 'Google Pay, PhonePe, Paytm',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, Rupay',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    desc: 'All major banks',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'wallet',
    label: 'Wallet',
    desc: 'Paytm, Amazon Pay',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-4M3 10l4-6m14 6l-4-6M17 14h.01" />
      </svg>
    ),
  },
]

export default function BuyGoldModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState('rupees') // 'rupees' | 'grams'
  const [karat, setKarat] = useState('24K') // '24K' | '22K'
  const [amount, setAmount] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [purchased, setPurchased] = useState(false)
  const { goldPrice } = useGoldPrice()

  const pricePerGram = karat === '22K'
    ? (goldPrice?.price22K || FALLBACK_PRICES['22K'])
    : (goldPrice?.price24K || FALLBACK_PRICES['24K'])

  const rupees = mode === 'rupees' ? Number(amount) || 0 : (Number(amount) || 0) * pricePerGram
  const grams = mode === 'grams' ? Number(amount) || 0 : (Number(amount) || 0) / pricePerGram

  const isValidAmount = amount !== '' && Number(amount) > 0

  function reset() {
    setStep(1)
    setMode('rupees')
    setKarat('24K')
    setAmount('')
    setSelectedPayment(null)
    setPurchasing(false)
    setError('')
    setPurchased(false)
  }

  function handleClose() {
    const didPurchase = purchased
    reset()
    onClose(didPurchase)
  }

  async function handlePay() {
    setPurchasing(true)
    setError('')
    try {
      await api.buyGold({ amount: rupees, paymentMethod: selectedPayment, karat })
      setPurchased(true)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
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
          <h3 className="text-lg font-bold text-[#1C1917]">Buy Gold</h3>
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
                  s <= step ? 'bg-[#B8860B] text-white' : 'bg-[#E5E5E5] text-[#999]'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 transition-colors ${s < step ? 'bg-[#B8860B]' : 'bg-[#E5E5E5]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-5">
          {step === 1 && (
            <StepAmount
              mode={mode}
              setMode={setMode}
              karat={karat}
              setKarat={setKarat}
              amount={amount}
              setAmount={setAmount}
              pricePerGram={pricePerGram}
              rupees={rupees}
              grams={grams}
              isValid={isValidAmount}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepPayment
              selected={selectedPayment}
              onSelect={setSelectedPayment}
              rupees={rupees}
              onBack={() => setStep(1)}
              onPay={handlePay}
              purchasing={purchasing}
              error={error}
            />
          )}
          {step === 3 && (
            <StepSuccess
              grams={grams}
              rupees={rupees}
              pricePerGram={pricePerGram}
              karat={karat}
              onDone={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Step 1: Enter Amount ─────────────────────────────────── */
function StepAmount({ mode, setMode, karat, setKarat, amount, setAmount, pricePerGram, rupees, grams, isValid, onContinue }) {
  return (
    <div>
      {/* Karat selector */}
      <div className="flex bg-[#F5F5F5] rounded-xl p-1 mb-3">
        {['24K', '22K'].map((k) => (
          <button
            key={k}
            onClick={() => { setKarat(k); setAmount('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              karat === k ? 'bg-white text-[#B8860B] shadow-sm' : 'text-[#999]'
            }`}
          >
            {k} Gold
          </button>
        ))}
      </div>

      {/* Toggle tabs */}
      <div className="flex bg-[#F5F5F5] rounded-xl p-1 mb-5">
        {['rupees', 'grams'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setAmount('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              mode === m ? 'bg-white text-[#B8860B] shadow-sm' : 'text-[#999]'
            }`}
          >
            {m === 'rupees' ? 'By Rupees (₹)' : 'By Grams (g)'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm text-[#666] mb-1.5">
          {mode === 'rupees' ? 'Enter amount in Rupees' : 'Enter weight in Grams'}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-lg font-medium">
            {mode === 'rupees' ? '₹' : 'g'}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={mode === 'rupees' ? '5000' : '1.000'}
            className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl text-lg font-semibold text-[#1C1917] focus:outline-none focus:border-[#B8860B] transition-colors"
            min="0"
            step={mode === 'grams' ? '0.001' : '1'}
          />
        </div>
      </div>

      {/* Live calculation */}
      {isValid && (
        <div className="bg-[#E5D3A3/20] border border-[#B8860B]/30 rounded-xl p-3 mb-4">
          <p className="text-sm text-[#666]">
            {mode === 'rupees' ? (
              <>You'll get <span className="font-bold text-[#1C1917]">{grams.toFixed(3)}g</span> of {karat} gold</>
            ) : (
              <>You'll pay <span className="font-bold text-[#1C1917]">₹{rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></>
            )}
          </p>
        </div>
      )}

      {/* Price info */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs text-[#999]">
          {karat} Gold: <span className="text-[#1C1917] font-medium">₹{pricePerGram.toLocaleString('en-IN')}/g</span>
        </p>
      </div>

      {/* Quick amounts */}
      {mode === 'rupees' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[500, 1000, 2000, 5000, 10000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer ${
                Number(amount) === v
                  ? 'border-[#B8860B] bg-[#B8860B]/5 text-[#B8860B] font-medium'
                  : 'border-[#E5E5E5] text-[#666] hover:border-[#B8860B]'
              }`}
            >
              ₹{v.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      )}

      <button
        disabled={!isValid}
        onClick={onContinue}
        className="w-full py-3 bg-[#B8860B] text-[#1C1917] rounded-xl font-semibold transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}

/* ── Step 2: Payment Method ───────────────────────────────── */
function StepPayment({ selected, onSelect, rupees, onBack, onPay, purchasing, error }) {
  return (
    <div>
      <p className="text-sm text-[#666] mb-4">Select payment method</p>

      <div className="space-y-2 mb-6">
        {paymentMethods.map((pm) => (
          <button
            key={pm.id}
            onClick={() => onSelect(pm.id)}
            disabled={purchasing}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              selected === pm.id
                ? 'border-[#B8860B] bg-[#B8860B]/5'
                : 'border-[#E5E5E5] hover:border-[#B8860B]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              selected === pm.id ? 'bg-[#B8860B] text-white' : 'bg-[#F5F5F5] text-[#666]'
            }`}>
              {pm.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1C1917]">{pm.label}</p>
              <p className="text-xs text-[#999]">{pm.desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === pm.id ? 'border-[#B8860B]' : 'border-[#ccc]'
            }`}>
              {selected === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={purchasing}
          className="flex-1 py-3 border border-[#E5E5E5] text-[#666] rounded-xl font-semibold hover:bg-[#F5F5F5] transition-colors cursor-pointer disabled:opacity-40"
        >
          Back
        </button>
        <button
          disabled={!selected || purchasing}
          onClick={onPay}
          className="flex-1 py-3 bg-[#B8860B] text-[#1C1917] rounded-xl font-semibold transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {purchasing ? 'Processing...' : `Pay ₹${rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
        </button>
      </div>
    </div>
  )
}

/* ── Step 3: Success ──────────────────────────────────────── */
function StepSuccess({ grams, rupees, pricePerGram, karat, onDone }) {
  return (
    <div className="text-center py-4">
      {/* Animated checkmark */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-[scale-in_0.3s_ease-out]">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h4 className="text-xl font-bold text-[#1C1917] mb-1">Purchase Successful!</h4>
      <p className="text-sm text-[#999] mb-6">{karat} Gold has been added to your vault</p>

      {/* Summary */}
      <div className="bg-[#F5F5F5] rounded-xl p-4 text-left space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Gold Purchased</span>
          <span className="font-semibold text-[#1C1917]">{grams.toFixed(3)}g ({karat})</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Amount Paid</span>
          <span className="font-semibold text-[#1C1917]">₹{rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666]">Price per Gram ({karat})</span>
          <span className="font-semibold text-[#1C1917]">₹{pricePerGram.toLocaleString('en-IN')}/g</span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-3 bg-[#B8860B] text-[#1C1917] rounded-xl font-semibold cursor-pointer hover:bg-[#D4AF37] transition-colors"
      >
        Done
      </button>
    </div>
  )
}
