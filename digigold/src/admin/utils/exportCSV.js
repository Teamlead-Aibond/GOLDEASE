const API_BASE = '/api'

function getAdminToken() {
  return localStorage.getItem('goldease_admin_token')
}

function buildQuery(params) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  )
  const query = new URLSearchParams(filtered).toString()
  return query ? `?${query}` : ''
}

async function downloadCSV(endpoint, params = {}) {
  const token = getAdminToken()
  const url = `${API_BASE}${endpoint}${buildQuery(params)}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Export failed')
  }

  // Extract filename from Content-Disposition header
  const disposition = res.headers.get('Content-Disposition') || ''
  const filenameMatch = disposition.match(/filename="(.+)"/)
  const filename = filenameMatch ? filenameMatch[1] : 'export.csv'

  // Download the blob
  const blob = await res.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export const exportCSV = {
  customers: (params) => downloadCSV('/admin/customers/export', params),
  payments: (params) => downloadCSV('/admin/payments/export', params),
  ornaments: (params) => downloadCSV('/admin/ornaments/export', params),
  dailyReport: (params) => downloadCSV('/admin/daily-report/export', params),
  monthlyReport: (params) => downloadCSV('/admin/monthly-report/export', params),
  redemptionLogs: (params) => downloadCSV('/admin/redemption-logs/export', params),
}
