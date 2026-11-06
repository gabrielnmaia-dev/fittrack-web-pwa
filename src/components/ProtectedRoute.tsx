import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PageLoader } from './ui/States'

export default function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="boot-screen">
        <div className="boot-brand">
          <span className="brand-mark">FT</span>
          <strong>FitTrack</strong>
        </div>
        <PageLoader label="Preparando seu treino..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
