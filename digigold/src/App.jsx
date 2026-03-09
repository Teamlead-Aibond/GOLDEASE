import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

// Admin
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import AdminProtectedRoute from './admin/components/AdminProtectedRoute'
import AdminLayout from './admin/components/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminCustomers from './admin/pages/AdminCustomers'
import AdminPayments from './admin/pages/AdminPayments'
import AdminDailyReport from './admin/pages/AdminDailyReport'
import AdminMonthlyReport from './admin/pages/AdminMonthlyReport'
import AdminOrnaments from './admin/pages/AdminOrnaments'
import AdminRedeemVerification from './admin/pages/AdminRedeemVerification'

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* User routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="ornaments" element={<AdminOrnaments />} />
              <Route path="redeem-verification" element={<AdminRedeemVerification />} />
              <Route path="daily-report" element={<AdminDailyReport />} />
              <Route path="monthly-report" element={<AdminMonthlyReport />} />
            </Route>
          </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  )
}
