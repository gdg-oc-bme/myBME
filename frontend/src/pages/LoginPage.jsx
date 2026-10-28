import { useNavigate } from 'react-router'
import { useAuth } from '../auth/auth.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    login()
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-16">
      <div className="rounded-xl border border-line bg-white p-8 text-center">
        <span className="inline-block font-serif text-lg font-bold bg-bme-red text-white px-2 py-0.5 rounded">BME</span>
        <h1 className="mt-4 font-serif text-2xl font-bold">Sign in to myBME</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Use your BME eduID – the same account you use for other university services.
        </p>

        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 w-full rounded-md bg-bme-red px-4 py-3 font-semibold text-white hover:bg-bme-red-dark"
        >
          Sign in with BME eduID
        </button>

        <p className="mt-4 text-xs text-ink-soft">
          Prototype: this signs you in as a demo student. No real credentials are used.
        </p>
      </div>
    </div>
  )
}
