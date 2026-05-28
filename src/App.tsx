import AppShell from './components/layout/AppShell'
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

export default function App() {
  return (
    <AppShell>
      {getPage()}
    </AppShell>
  )
}
