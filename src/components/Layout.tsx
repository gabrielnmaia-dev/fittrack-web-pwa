import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useInstallPrompt, useOnlineStatus } from '../hooks/usePwa'
import { displayName, goalLabel, initials } from '../lib/format'
import { ThemeToggle } from './ThemeToggle'
import Icon, { type IconName } from './ui/Icon'
import { useToast } from './ui/Toast'

interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

const primaryNav: NavItem[] = [
  { to: '/inicio', label: 'Início', icon: 'home', end: true },
  { to: '/treinos', label: 'Treinos', icon: 'dumbbell' },
  { to: '/dietas', label: 'Dietas', icon: 'leaf' },
  { to: '/exercicios', label: 'Exercícios', icon: 'activity' },
  { to: '/perfil', label: 'Perfil', icon: 'user' },
]

function resolvePageTitle(pathname: string): string {
  if (pathname.startsWith('/inicio')) return 'Início — FitTrack'
  if (pathname === '/treinos/novo') return 'Novo treino — FitTrack'
  if (pathname.startsWith('/treinos/') && pathname.endsWith('/editar')) {
    return 'Editar treino — FitTrack'
  }
  if (pathname.startsWith('/treinos/')) return 'Detalhes do treino — FitTrack'
  if (pathname.startsWith('/treinos')) return 'Meus treinos — FitTrack'
  if (pathname.startsWith('/dietas/')) return 'Detalhes da dieta — FitTrack'
  if (pathname.startsWith('/dietas')) return 'Minhas dietas — FitTrack'
  if (pathname.startsWith('/exercicios')) return 'Exercícios — FitTrack'
  if (pathname.startsWith('/perfil')) return 'Meu perfil — FitTrack'
  if (pathname.startsWith('/usuarios')) return 'Usuários — FitTrack'
  return 'FitTrack — Treino & Nutrição'
}

export default function Layout() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const isOnline = useOnlineStatus()
  const { canInstall, promptInstall } = useInstallPrompt()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    document.title = resolvePageTitle(location.pathname)
  }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  async function handleInstall() {
    const installed = await promptInstall()
    if (installed) {
      toast('FitTrack instalado no seu dispositivo!', 'success')
    }
  }

  const nav = user?.is_staff
    ? [...primaryNav, { to: '/usuarios', label: 'Usuários', icon: 'users' as IconName }]
    : primaryNav

  return (
    <div className="app-shell">
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <aside className="sidebar">
        <NavLink to="/inicio" className="brand" aria-label="FitTrack, início">
          <span className="brand-mark">
            <Icon name="dumbbell" size={22} />
          </span>
          <span className="brand-copy">
            <strong>FitTrack</strong>
            <small>treino & nutrição</small>
          </span>
        </NavLink>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <span className="nav-section-label">Menu</span>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              <span className="nav-dot" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {canInstall && (
            <button
              type="button"
              className="pwa-install-card"
              onClick={() => void handleInstall()}
            >
              <span className="pwa-install-icon">
                <Icon name="download" size={17} />
              </span>
              <span className="pwa-install-copy">
                <strong>Instalar aplicativo</strong>
                <small>Acesso rápido na tela inicial</small>
              </span>
            </button>
          )}

          <div className="sidebar-theme">
            <span>Aparência</span>
            <ThemeToggle />
          </div>

          {user && (
            <div className="user-chip">
              <NavLink to="/perfil" className="avatar" aria-label="Abrir perfil">
                {initials(displayName(user))}
              </NavLink>
              <div className="user-chip-copy">
                <strong>{displayName(user)}</strong>
                <small>{goalLabel(user.profile?.goal)}</small>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={handleLogout}
                aria-label="Sair"
                title="Sair"
              >
                <Icon name="logout" size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="app-column">
        <header className="mobile-header">
          <NavLink to="/inicio" className="brand brand-mobile">
            <span className="brand-mark">
              <Icon name="dumbbell" size={19} />
            </span>
            <strong>FitTrack</strong>
          </NavLink>
          <div className="mobile-header-actions">
            {canInstall && (
              <button
                type="button"
                className="icon-btn theme-toggle"
                onClick={() => void handleInstall()}
                aria-label="Instalar aplicativo"
                title="Instalar aplicativo"
              >
                <Icon name="download" size={18} />
              </button>
            )}
            <ThemeToggle compact />
            <NavLink to="/perfil" className="avatar avatar-sm" aria-label="Abrir perfil">
              {initials(displayName(user))}
            </NavLink>
          </div>
        </header>

        {!isOnline && (
          <div className="offline-banner" role="status" aria-live="assertive">
            <Icon name="wifiOff" size={16} />
            <span>
              <strong>Modo offline:</strong> exibindo dados em cache. Reconecte-se para salvar alterações.
            </span>
          </div>
        )}

        <main id="conteudo-principal" className="app-main" tabIndex={-1}>
          <div className="page-container">
            <Outlet />
          </div>
        </main>

        <nav className="bottom-nav" aria-label="Navegação principal">
          {nav.slice(0, 6).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="bottom-nav-icon">
                <Icon name={item.icon} size={21} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
