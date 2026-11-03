import { CalendarDays, House, LogIn, LogOut } from 'lucide-react'
import { NavLink } from 'react-router'
import { useAuth } from '../auth/auth.js'

const itemClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${isActive ? 'text-bme-red' : 'text-ink-soft'}`

// Phone-only tab bar; on wider screens the header carries the navigation.
export default function BottomNav() {
  const { status, user, logout } = useAuth()

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom,0px)] sm:hidden"
    >
      <NavLink to="/" end className={itemClass}>
        <House className="size-5" aria-hidden="true" />
        Campus
      </NavLink>
      <NavLink to="/dashboard" className={itemClass}>
        <CalendarDays className="size-5" aria-hidden="true" />
        My day
      </NavLink>
      {status !== 'loading' &&
        (user ? (
          <button type="button" onClick={logout} className={itemClass({ isActive: false })}>
            <LogOut className="size-5" aria-hidden="true" />
            Sign out
          </button>
        ) : (
          <NavLink to="/login" className={itemClass}>
            <LogIn className="size-5" aria-hidden="true" />
            Sign in
          </NavLink>
        ))}
    </nav>
  )
}
