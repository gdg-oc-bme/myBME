import { Navigate } from 'react-router'
import { BACKEND_URL, loginUrl } from '../api/client.js'
import loginImage from '../assets/campus-k-building-night.webp'
import { useAuth } from '../auth/auth.js'

export default function LoginPage() {
  const { status, user, loginAsDemo } = useAuth()

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <div className="grid overflow-hidden bg-white border border-line md:grid-cols-2">
        <img
          src={loginImage}
          alt="The K building of BME lit up at night"
          className="h-48 w-full object-cover md:h-full"
        />

        <div className="p-8 sm:p-12">
          <h1 className="font-serif text-3xl font-bold">Sign in</h1>
          <p className="mt-3 text-ink-soft">
            Use your BME eduID – the same account you use for Moodle and other university services. You’ll be
            taken to the BME login page and brought back here afterwards.
          </p>

          {/* A plain link, not fetch(): SAML login is a full-page redirect (issue #10). */}
          <a
            href={loginUrl}
            className="mt-8 block bg-bme-red px-4 py-3 text-center font-semibold text-white hover:bg-bme-red-dark"
          >
            Sign in with BME eduID
          </a>

          <p className="mt-4 text-sm text-ink-soft">
            No password yet?{' '}
            <a
              href="https://net.bme.hu/cimtar/?lang=en"
              target="_blank"
              rel="noreferrer"
              className="text-bme-red underline underline-offset-2"
            >
              Set up your eduID
            </a>
          </p>

          {status === 'offline' && (
            <div className="mt-8 border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">
              <p>
                The backend isn’t reachable at <code>{BACKEND_URL}</code>, so sign-in won’t work right now.
              </p>
              {import.meta.env.DEV && (
                <button type="button" onClick={loginAsDemo} className="mt-2 font-semibold underline">
                  Continue with a demo account (development only)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
