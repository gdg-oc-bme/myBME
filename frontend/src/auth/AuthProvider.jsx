import { useEffect, useState } from 'react'
import { ApiError, apiGet, logoutUrl } from '../api/client.js'
import { AuthContext } from './auth.js'

// Only used in local development when the backend isn't running.
const demoUser = {
  username: 'demo@bme.hu',
  email: 'demo.student@edu.bme.hu',
  first_name: 'Demo',
  last_name: 'Student',
}

// status: 'loading' | 'authenticated' | 'anonymous' | 'offline' | 'demo'
export default function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null })

  // Login state comes from the backend session, never from a stored flag (issue #14).
  useEffect(() => {
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
  }, [])

  const value = {
    ...state,
    loginAsDemo: () => setState({ status: 'demo', user: demoUser }),
    logout: () => {
      if (state.status === 'demo') setState({ status: 'anonymous', user: null })
      else window.location.assign(logoutUrl)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
