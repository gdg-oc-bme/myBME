import { Navigate, Route, Routes } from 'react-router'
import { useAuth } from './auth/auth.js'
import BottomNav from './components/BottomNav.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function RequireLogin({ children }) {
  const { status, user } = useAuth()
  if (status === 'loading') return <p className="mx-auto max-w-6xl px-4 py-16 text-ink-soft">Loading…</p>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col pb-16 sm:pb-0">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* The backend redirects here after a successful eduID login (issues #11/#12). */}
          <Route
            path="/dashboard"
            element={
              <RequireLogin>
                <DashboardPage />
              </RequireLogin>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
