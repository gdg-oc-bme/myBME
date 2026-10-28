import { useState } from 'react'
import { demoStudent } from '../data/demoStudent.js'
import { AuthContext } from './auth.js'

// DEMO ONLY: there is no real authentication yet.
// Later, `login` will redirect to BME eduID (Címtár SSO) through the backend,
// and `user` will come from the backend session.
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const value = {
    user,
    login: () => setUser(demoStudent),
    logout: () => setUser(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
