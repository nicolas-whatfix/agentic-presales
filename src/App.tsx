import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DbTest from './pages/DbTest'
import Discovery from './pages/Discovery'
import AdminSettings from './pages/AdminSettings'

function getPage() {
  const path = window.location.pathname
  if (path === '/db-test') return <DbTest />
  if (path === '/discovery') return <Discovery />
  if (path === '/settings') return <AdminSettings />
  return <Dashboard />
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-loading">
        <span className="wf-logo-dot" />
      </div>
    )
  }

  if (!user) return <Login />

  return <AppShell>{getPage()}</AppShell>
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
