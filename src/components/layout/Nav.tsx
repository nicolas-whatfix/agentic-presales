import { NavLink } from './NavLink'

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav-brand">SaaS Template</span>
      <div className="nav-links">
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/db-test">DB Test</NavLink>
      </div>
    </nav>
  )
}
