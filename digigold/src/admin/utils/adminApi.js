const API_BASE = 'http://localhost:5000/api'

function getAdminToken() {
  return localStorage.getItem('goldease_admin_token')
}

function adminHeaders() {
  const token = getAdminToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...adminHeaders(),
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

function buildQuery(params) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  )
  const query = new URLSearchParams(filtered).toString()
  return query ? `?${query}` : ''
}

export const adminApi = {
  // Auth
  login: (body) => request('/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/admin/me'),

  // Dashboard
  getDashboardSummary: () => request('/admin/dashboard-summary'),
  getDashboardExtended: (params = {}) => request(`/admin/dashboard-extended${buildQuery(params)}`),
  getDailyReport: (params = {}) => request(`/admin/daily-report${buildQuery(params)}`),
  getMonthlyReport: (params = {}) => request(`/admin/monthly-report${buildQuery(params)}`),
  getCustomers: (params = {}) => request(`/admin/customers${buildQuery(params)}`),
  getPayments: (params = {}) => request(`/admin/payments${buildQuery(params)}`),
  getOrnaments: (params = {}) => request(`/admin/ornaments${buildQuery(params)}`),
  getOrnamentCategoryStats: (params = {}) => request(`/admin/ornaments/category-stats${buildQuery(params)}`),

  // Redeem Verification
  lookupRedeemCode: (code) => request(`/admin/redeem-verify?code=${encodeURIComponent(code)}`),
  confirmRedemption: (ornamentId) => request(`/admin/redeem-verify/${ornamentId}/confirm`, { method: 'PATCH' }),
  getRedemptionLogs: (params = {}) => request(`/admin/redemption-logs${buildQuery(params)}`),
  getCustomerTransactions: (userId) => request(`/admin/customers/${userId}/transactions`),
}
