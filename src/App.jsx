import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Staff from './pages/Staff'
import Events from './pages/Events'
import Compose from './pages/Compose'
import History from './pages/History'
import SettingsPage from './pages/Settings'

function Protected({ children }) {
  const { user, loading, usingCloud } = useAuth()
  if (loading) return null
  if (usingCloud && !user) return <Navigate to="/login" replace />
  return children
}

function RoutesApp() {
  const { loading } = useApp()
  if (loading) {
    return (
      <div className="login-page">
        <p className="meta">Connecting to Blumen workspace…</p>
      </div>
    )
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="staff" element={<Staff />} />
        <Route path="events" element={<Events />} />
        <Route path="compose" element={<Compose />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <RoutesApp />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
