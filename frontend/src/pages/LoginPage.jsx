import { Navigate, useNavigate } from 'react-router'
import { BACKEND_URL, loginUrl } from '../api/client.js'
import loginImage from '../assets/campus-k-building-night.webp'
import { useAuth } from '../auth/auth.js'

export default function LoginPage() {
  const { status, user, loginAsDemo } = useAuth()
  const navigate = useNavigate()

  if (user) return <Navigate to="/dashboard" replace />

  const backendDown = status === 'offline'
  const canDemo = import.meta.env.DEV

  const startDemo = () => {
    loginAsDemo()
    void navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="grid overflow-hidden rounded-3xl bg-white md:grid-cols-2">
        <div className="relative min-h-56">
          <img
            src={loginImage}
            alt="The K building of BME lit up at night"
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="p-8 sm:p-12">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-3 text-ink-soft">
            Sign in with your BME eduID – the same account you use for other university services. You’ll be taken
            to the BME login page and brought back to your day.
          </p>

          {backendDown && canDemo ? (
            <>
              <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                The backend isn’t running at <code>{BACKEND_URL}</code>, so eduID sign-in won’t work right now.
                Use the demo account to look around.
              </div>
              <button
                type="button"
                onClick={startDemo}
                className="mt-4 block w-full rounded-full bg-bme-red px-4 py-3 text-center font-semibold text-white hover:bg-bme-red-dark"
              >
                Continue with demo account
              </button>
              <a href={loginUrl} className="mt-3 block text-center text-sm text-ink-soft underline">
                Try eduID sign-in anyway
              </a>
            </>
          ) : (
            <>
              {/* A plain link, not fetch(): SAML login is a full-page redirect (issue #10). */}
              <a
                href={loginUrl}
                className="mt-8 block rounded-full bg-bme-red px-4 py-3 text-center font-semibold text-white hover:bg-bme-red-dark"
              >
                Sign in with BME eduID
              </a>
              {backendDown && (
                <p className="mt-3 text-sm text-amber-900">
                  The backend isn’t reachable right now, so sign-in may not work.
                </p>
              )}
              {canDemo && !backendDown && (
                <button type="button" onClick={startDemo} className="mt-3 block w-full text-center text-sm text-ink-soft underline">
                  Continue with demo account (development only)
                </button>
              )}
            </>
          )}

          <p className="mt-8 text-sm text-ink-soft">
            No eduID password yet?{' '}
            <a
              href="https://net.bme.hu/cimtar/?lang=en"
              target="_blank"
              rel="noreferrer"
              className="text-bme-red underline underline-offset-2"
            >
              Set it up here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
