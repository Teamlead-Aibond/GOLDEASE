import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check for existing token
  useEffect(() => {
    const token = localStorage.getItem('goldease_token')
    if (token) {
      api.getMe()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('goldease_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await api.login({ email, password })
    localStorage.setItem('goldease_token', data.token)
    setUser(data.user)
    return data
  }

  const register = async (formData) => {
    const data = await api.register(formData)
    localStorage.setItem('goldease_token', data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('goldease_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
