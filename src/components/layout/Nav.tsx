import { NavLink } from './NavLink'

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav-brand">
        <span className="wf-logo-dot" style={{ display: 'inline-block', marginRight: 6 }} />
        Whatfix Presales
      </span>
      <div className="nav-links">
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/discovery">Discovery</NavLink>
        <NavLink href="/settings">Settings</NavLink>
      </div>
    </nav>
  )
}
