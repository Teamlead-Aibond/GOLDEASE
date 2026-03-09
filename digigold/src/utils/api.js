const API_BASE = 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('goldease_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  getPortfolio: () => request('/auth/portfolio'),

  // Gold
  getGoldPrice: () => request('/gold/price'),
  buyGold: (body) => request('/gold/buy', { method: 'POST', body: JSON.stringify(body) }),
  redeemGold: (body) => request('/gold/redeem', { method: 'POST', body: JSON.stringify(body) }),

  // Transactions
  getTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/transactions${query ? `?${query}` : ''}`)
  },

}
