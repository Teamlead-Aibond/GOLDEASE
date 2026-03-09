import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
