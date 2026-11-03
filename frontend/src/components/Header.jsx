import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/auth.js'

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'
  }`

export default function Header() {
  const { status, user, logout } = useAuth()

  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_0_var(--color-line)]">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tight" aria-label="myBME home">
          <span className="text-bme-red">my</span>BME
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navClass}>
            Campus
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navClass}>
              My day
            </NavLink>
          )}
          {status !== 'loading' &&
            (user ? (
              <button
                type="button"
                onClick={logout}
                className="ml-1 rounded-full px-3 py-1.5 text-sm text-ink-soft hover:text-bme-red"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-1 rounded-full bg-bme-red px-4 py-1.5 text-sm font-semibold text-white hover:bg-bme-red-dark"
              >
                Sign in
              </Link>
            ))}
        </nav>
      </div>
    </header>
  )
}
