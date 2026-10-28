import { LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/auth.js'

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded text-sm font-medium transition-colors ${
    isActive ? 'text-bme-red' : 'text-ink-soft hover:text-bme-red'
  }`

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-line">
      <div className="h-1 bg-bme-red" />
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" aria-label="myBME home">
          <span className="font-serif text-2xl font-bold">my</span>
          <span className="font-serif text-lg font-bold bg-bme-red text-white px-2 py-0.5 rounded">BME</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            Campus
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={navClass}>
                My dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="ml-1 inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm text-ink-soft hover:text-bme-red"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-1 rounded-md bg-bme-red px-4 py-2 text-sm font-semibold text-white hover:bg-bme-red-dark"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
