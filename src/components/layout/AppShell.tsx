import type { ReactNode } from 'react'
import Nav from './Nav'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Nav />
      <main className="main-content">{children}</main>
    </div>
  )
}
