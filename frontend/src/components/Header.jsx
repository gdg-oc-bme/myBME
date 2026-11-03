import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/auth.js'

const navClass = ({ isActive }) =>
  `py-5 border-b-2 text-sm font-medium transition-colors ${
    isActive ? 'border-bme-red text-ink' : 'border-transparent text-ink-soft hover:text-ink'
  }`

export default function Header() {
  const { status, user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-line">
      <div className="bg-ink text-white/75 text-xs">
        <div className="mx-auto max-w-6xl px-4 py-1.5 flex justify-between gap-4">
          <span>Budapest University of Technology and Economics</span>
          <span className="hidden sm:inline">A student project by GDG on Campus BME</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline py-4" aria-label="myBME home">
          <span className="font-serif text-2xl font-bold text-ink">my</span>
          <span className="font-serif text-2xl font-bold text-bme-red">BME</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-6">
          <NavLink to="/" end className={navClass}>
            Campus
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navClass}>
              My BME
            </NavLink>
          )}
          {status !== 'loading' &&
            (user ? (
              <button type="button" onClick={logout} className="text-sm text-ink-soft hover:text-bme-red">
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-bme-red px-4 py-2 text-sm font-semibold text-white hover:bg-bme-red-dark"
              >
                Sign in
              </Link>
            ))}
        </nav>
      </div>
    </header>
  )
}
