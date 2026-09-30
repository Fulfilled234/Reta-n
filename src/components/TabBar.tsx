import { NavLink } from 'react-router-dom'

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function CustomersIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c0-3 2.5-5.2 5.5-5.2S14.5 16 14.5 19" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15 13.3c2.4.2 4.5 2.1 4.5 5" />
    </svg>
  )
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5c.1-.5.1-1 0-1.5l1.8-1.4-2-3.4-2.1.6a7.6 7.6 0 00-1.3-.8l-.3-2.2H10.5l-.3 2.2c-.5.2-.9.5-1.3.8l-2.1-.6-2 3.4L6.6 12c-.1.5-.1 1 0 1.5l-1.8 1.4 2 3.4 2.1-.6c.4.3.8.6 1.3.8l.3 2.2h3.1l.3-2.2c.5-.2.9-.5 1.3-.8l2.1.6 2-3.4-1.8-1.4z" />
    </svg>
  )
}

const items = [
  { to: '/today', label: 'Today', Icon: HomeIcon },
  { to: '/customers', label: 'Customers', Icon: CustomersIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon }
]

export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-line flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2.5 ${isActive ? 'text-brand-dark' : 'text-muted'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
