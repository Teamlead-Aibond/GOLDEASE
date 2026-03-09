import { createContext, useContext, useState, useEffect } from 'react'
import { adminApi } from '../utils/adminApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('goldease_admin_token')
    if (token) {
      adminApi.getMe()
        .then((data) => setAdmin(data))
        .catch(() => {
          localStorage.removeItem('goldease_admin_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await adminApi.login({ email, password })
    localStorage.setItem('goldease_admin_token', data.token)
    setAdmin(data.admin)
    return data
  }

  const logout = () => {
    localStorage.removeItem('goldease_admin_token')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return context
}
