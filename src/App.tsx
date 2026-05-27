import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import DbTest from './pages/DbTest'

function getPage() {
  const path = window.location.pathname
  if (path === '/db-test') return <DbTest />
  return <Dashboard />
}

export default function App() {
  return (
    <AppShell>
      {getPage()}
    </AppShell>
  )
}
