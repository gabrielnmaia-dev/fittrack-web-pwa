import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>FitTrack</h1>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/treinos">Treinos</NavLink>
        <NavLink to="/dietas">Dietas</NavLink>
      </nav>
    </div>
  )
}
