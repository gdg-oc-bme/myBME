export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000').replace(/\/$/, '')

// SAML login/logout are full-page navigations, not fetch() calls (issue #10).
export const loginUrl = `${BACKEND_URL}/saml2/login/`
export const logoutUrl = `${BACKEND_URL}/saml2/logout/`

export class ApiError extends Error {
  constructor(status) {
    super(`Request failed with status ${status}`)
    this.status = status
  }
}

// The session lives in a cookie, so every request must send credentials (issue #13).
export async function apiGet(path) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new ApiError(res.status)
  return res.json()
}
