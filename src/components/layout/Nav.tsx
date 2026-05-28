import { NavLink } from './NavLink'
import { useAuth } from '../../contexts/AuthContext'

export default function Nav() {
  const { user, signOut } = useAuth()

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
      <div className="nav-user">
        <span className="nav-user-email">{user?.email}</span>
        <button className="nav-signout" onClick={signOut}>Sign out</button>
      </div>
    </nav>
  )
}
