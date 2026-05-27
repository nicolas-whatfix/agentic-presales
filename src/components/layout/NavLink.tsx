interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const isActive = window.location.pathname === href
  return (
    <a href={href} className={`nav-link${isActive ? ' active' : ''}`}>
      {children}
    </a>
  )
}
