import { useState, useRef, useEffect } from 'react'
import useGoldPrice from '../hooks/useGoldPrice'

const QUICK_ACTIONS = [
  { id: 'gold_price', label: 'Today\'s Gold Price', icon: '💰' },
  { id: 'buy_gold', label: 'Buy Digital Gold', icon: '🪙' },
]

function getBotReplies(goldPrice) {
  const priceText = goldPrice
    ? `24K Gold: ₹${goldPrice.price24K.toLocaleString()}/gram\n22K Gold: ₹${goldPrice.price22K.toLocaleString()}/gram\n18K Gold: ₹${goldPrice.price18K.toLocaleString()}/gram`
    : 'Prices are currently unavailable. Please try again shortly.'

  return {
    gold_price: [
      { text: `📊 *Today's Gold Price*\n\n${priceText}\n\nPrices updated as of today. Want to buy gold at this rate?`, delay: 800 },
      { text: 'You can buy as little as ₹100 worth of gold! Would you like to proceed?', delay: 1500, actions: ['buy_gold'] },
    ],
    buy_gold: [
      { text: '🪙 *Buy Digital Gold*\n\nGreat choice! Here\'s how it works:\n\n1️⃣ Choose amount (₹ or grams)\n2️⃣ Make secure payment\n3️⃣ Gold stored in your vault\n\nMinimum purchase: ₹100', delay: 800 },
      { text: 'To complete your purchase, please log in to your GoldEase account or sign up if you\'re new!\n\nVisit our app to buy now.', delay: 1500 },
    ],
    default: [
      { text: 'Thanks for your message! Please choose from the options below to get started.', delay: 800 },
    ],
  }
}

const PHONE_NUMBER = '919876543210' // placeholder

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white rounded-xl rounded-tl-none w-fit shadow-sm">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef(null)
  const { goldPrice } = useGoldPrice()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const openChat = () => {
    setIsOpen(true)
    if (!hasInteracted) {
      setHasInteracted(true)
      // Initial welcome message
      setTimeout(() => {
        setMessages([
          {
            id: Date.now(),
            type: 'bot',
            text: 'Hello! 👋 Welcome to *GoldEase*.\n\nI\'m your digital gold assistant. How can I help you today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, 300)
    }
  }

  const addBotReplies = (replies) => {
    setIsTyping(true)
    replies.forEach((reply, index) => {
      setTimeout(() => {
        if (index === replies.length - 1) setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + index,
            type: 'bot',
            text: reply.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: reply.actions,
          },
        ])
      }, reply.delay)
    })
  }

  const handleQuickAction = (actionId) => {
    const action = QUICK_ACTIONS.find((a) => a.id === actionId)
    if (!action) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        text: action.label,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])

    // Add bot replies
    const botReplies = getBotReplies(goldPrice)
    const replies = botReplies[actionId] || botReplies.default
    addBotReplies(replies)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        text: inputValue.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setInputValue('')
    addBotReplies(getBotReplies(goldPrice).default)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const openWhatsApp = () => {
    const text = encodeURIComponent('Hi! I\'m interested in GoldEase services.')
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, '_blank')
  }

  const formatText = (text) => {
    // Bold: *text* → <strong>text</strong>
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {i > 0 && <br />}
        {line.split(/(\*[^*]+\*)/).map((part, j) =>
          part.startsWith('*') && part.endsWith('*') ? (
            <strong key={j} className="font-semibold">{part.slice(1, -1)}</strong>
          ) : (
            part
          )
        )}
      </span>
    ))
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-[#e5ddd5] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-sm shrink-0">
              DG
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] truncate">GoldEase Support</h3>
              <p className="text-[12px] text-green-200 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                Online now
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Background Pattern */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8c3b8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-[14px] leading-relaxed shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-[#dcf8c6] rounded-tr-none text-gray-800'
                      : 'bg-white rounded-tl-none text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{formatText(msg.text)}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.type === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {msg.time}
                    {msg.type === 'user' && <span className="ml-1 text-blue-500">✓✓</span>}
                  </p>
                  {/* Inline action buttons after certain messages */}
                  {msg.actions && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-200">
                      {msg.actions.map((actionId) => {
                        const action = QUICK_ACTIONS.find((a) => a.id === actionId)
                        return action ? (
                          <button
                            key={actionId}
                            onClick={() => handleQuickAction(actionId)}
                            className="text-[12px] px-2.5 py-1 bg-[#075e54] text-white rounded-full hover:bg-[#064e46] transition-colors"
                          >
                            {action.icon} {action.label}
                          </button>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}

            {/* Quick Actions (show after welcome message, before any user interaction) */}
            {messages.length === 1 && messages[0].type === 'bot' && !isTyping && (
              <div className="space-y-1.5 pt-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-xl text-left text-[13px] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors border border-gray-100"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="font-medium">{action.label}</span>
                    <svg className="w-4 h-4 ml-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-[#f0f0f0] px-3 py-2.5 flex items-end gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-white rounded-full text-[14px] text-gray-800 placeholder-gray-400 outline-none border-none"
            />
            <button
              onClick={inputValue.trim() ? handleSend : openWhatsApp}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                inputValue.trim()
                  ? 'bg-[#075e54] text-white hover:bg-[#064e46]'
                  : 'bg-[#25D366] text-white hover:bg-[#20bd5a]'
              }`}
              title={inputValue.trim() ? 'Send' : 'Open WhatsApp'}
            >
              {inputValue.trim() ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              ) : (
                <WhatsAppIcon size={20} />
              )}
            </button>
          </div>

          {/* Continue on WhatsApp bar */}
          <button
            onClick={openWhatsApp}
            className="bg-[#25D366] text-white text-[13px] font-medium py-2.5 flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shrink-0"
          >
            <WhatsAppIcon size={16} />
            Continue on WhatsApp
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        className={`fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 ${
          isOpen
            ? 'bg-[#075e54] text-white rotate-0 scale-90'
            : 'bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-110'
        }`}
        title="Chat with us on WhatsApp"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <WhatsAppIcon size={28} />
        )}
      </button>

      {/* Tooltip (only when chat is closed and user hasn't interacted) */}
      {!isOpen && !hasInteracted && (
        <div className="fixed bottom-[88px] right-4 sm:right-6 bg-white text-gray-800 text-[13px] font-medium px-4 py-2 rounded-xl shadow-lg z-50 animate-bounce whitespace-nowrap">
          Need help? Chat with us!
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 shadow-sm" />
        </div>
      )}
    </>
  )
}
