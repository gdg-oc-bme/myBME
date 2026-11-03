import { useEffect, useState } from 'react'
import { ApiError, apiGet, logoutUrl } from '../api/client.js'
import { AuthContext } from './auth.js'

// Only used in local development, until real eduID login works end to end.
const demoUser = {
  username: 'demo@bme.hu',
  email: 'demo.student@edu.bme.hu',
  first_name: 'Demo',
  last_name: 'Student',
}

// Keeps the dev-only demo session across page reloads. Real sessions never use this.
const DEMO_KEY = 'mybme-demo'
const demoFlag = {
  get: () => {
    try {
      return import.meta.env.DEV && sessionStorage.getItem(DEMO_KEY) === '1'
    } catch {
      return false
    }
  },
  set: (on) => {
    try {
      if (on) sessionStorage.setItem(DEMO_KEY, '1')
      else sessionStorage.removeItem(DEMO_KEY)
    } catch {
      // storage unavailable: demo just won't survive a reload
    }
  },
}

// status: 'loading' | 'authenticated' | 'anonymous' | 'offline' | 'demo'
export default function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    demoFlag.get() ? { status: 'demo', user: demoUser } : { status: 'loading', user: null },
  )

  // Login state comes from the backend session, never from a stored flag (issue #14).
  useEffect(() => {
    if (state.status !== 'loading') return
    let cancelled = false
    apiGet('/accounts/me/')
      .then((user) => {
        if (!cancelled) setState({ status: 'authenticated', user })
      })
      .catch((err) => {
        // ApiError = backend answered "not logged in"; anything else = backend unreachable.
        if (!cancelled) setState({ status: err instanceof ApiError ? 'anonymous' : 'offline', user: null })
      })
    return () => {
      cancelled = true
    }
  }, [state.status])

  const value = {
    ...state,
    loginAsDemo: () => {
      demoFlag.set(true)
      setState({ status: 'demo', user: demoUser })
    },
    logout: () => {
      if (state.status === 'demo') {
        demoFlag.set(false)
        setState({ status: 'anonymous', user: null })
      } else {
        window.location.assign(logoutUrl)
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
