const axios = require('axios')

let priceCache = {
  data: null,
  lastFetched: null,
}

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

async function fetchGoldPrice() {
  // Return cached if fresh
  if (priceCache.data && priceCache.lastFetched && (Date.now() - priceCache.lastFetched < CACHE_DURATION)) {
    return { ...priceCache.data, cached: true }
  }

  const apiKey = process.env.METALS_DEV_API_KEY
  if (!apiKey) {
    throw new Error('METALS_DEV_API_KEY not set in environment')
  }

  const response = await axios.get(`https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=INR&unit=g`)

  const data = response.data
  if (data.status !== 'success') {
    throw new Error(data.error_message || 'Metals.dev API request failed')
  }

  // Use IBJA rate (Indian retail standard) with MCX as fallback, then spot
  const price24K = data.metals.ibja_gold || data.metals.mcx_gold || data.metals.gold
  const price22K = price24K * (22 / 24)
  const price18K = price24K * (18 / 24)

  // Calculate change from MCX AM rate if available
  const openPrice = data.metals.mcx_gold_am || data.metals.ibja_gold || price24K
  const change = price24K - openPrice
  const changePercent = openPrice > 0 ? Number(((change / openPrice) * 100).toFixed(2)) : 0

  const goldData = {
    price24K: Math.round(price24K),
    price22K: Math.round(price22K),
    price18K: Math.round(price18K),
    pricePerOunce: Math.round(price24K * 31.1035),
    change: Math.round(change),
    changePercent,
    openPrice: Math.round(openPrice),
    highPrice: Math.round(data.metals.mcx_gold_pm || price24K),
    lowPrice: Math.round(data.metals.mcx_gold_am || price24K),
    timestamp: Date.now(),
    lastUpdated: new Date().toISOString(),
  }

  priceCache = { data: goldData, lastFetched: Date.now() }
  return { ...goldData, cached: false }
}

function getGoldPrice() {
  return priceCache.data
}

function setCacheFromExternal(data) {
  priceCache = { data, lastFetched: Date.now() }
}

module.exports = { fetchGoldPrice, getGoldPrice, setCacheFromExternal }
