import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../theme/ThemeContext'
import Icon from '../components/ui/Icon'
import { apiErrorMessage } from '../lib/format'

export default function LoginPage() {
  const { isAuthenticated, initializing, login } = useAuth()
  const { resolved, toggle } = useTheme()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!initializing && isAuthenticated) {
    return <Navigate to="/inicio" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Usuário ou senha inválidos.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <button
        type="button"
        className="auth-theme-toggle icon-btn"
        onClick={toggle}
        aria-label={resolved === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      >
        <Icon name={resolved === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>

      <section className="auth-showcase">
        <div className="auth-showcase-glow" />
        <div className="auth-brand">
          <span className="brand-mark brand-mark-lg">
            <Icon name="dumbbell" size={24} />
          </span>
          <span>
            <strong>FitTrack</strong>
            <small>Seu treino. Sua rotina. Seu progresso.</small>
          </span>
        </div>

        <div className="auth-showcase-copy">
          <span className="eyebrow">Treine com clareza</span>
          <h1>
            Cada série,
            <br />
            cada refeição,
            <br />
            <em>no lugar certo.</em>
          </h1>
          <p>
            Organize planos de treino, acompanhe sua alimentação e mantenha o foco em
            uma única rotina — leve, rápida e feita para o seu bolso.
          </p>
        </div>

        <div className="auth-preview" aria-hidden="true">
          <div className="preview-card preview-card-main">
            <div className="preview-card-head">
              <span className="preview-dot" />
              <span>Treino A · Peito & tríceps</span>
            </div>
            <div className="preview-metric">
              <strong>52</strong>
              <span>min</span>
            </div>
            <div className="preview-bars">
              {[52, 78, 64, 92, 70, 86, 58].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="preview-pills">
              <span>6 exercícios</span>
              <span>Intermediário</span>
            </div>
          </div>
          <div className="preview-card preview-card-float">
            <span className="preview-ring">78%</span>
            <div>
              <strong>Meta diária</strong>
              <small>2.180 kcal</small>
            </div>
          </div>
        </div>

        <div className="auth-showcase-footer">
          <span>
            <Icon name="shield" size={15} /> Seus dados ficam só com você
          </span>
          <span className="auth-dots" aria-hidden="true">
            <i className="active" />
            <i />
            <i />
          </span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-brand">
            <span className="brand-mark">
              <Icon name="dumbbell" size={20} />
            </span>
            <span>FitTrack</span>
          </div>

          <header className="auth-form-header">
            <span className="eyebrow">Bem-vindo de volta</span>
            <h2>Entre na sua conta</h2>
            <p>Continue de onde você parou. Seu progresso está esperando.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Usuário</span>
              <div className="input-shell">
                <Icon name="user" size={17} />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="seu.usuario"
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Senha</span>
              <div className="input-shell">
                <Icon name="lock" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={17} />
                </button>
              </div>
            </label>

            {error && (
              <p className="form-error" role="alert">
                <Icon name="alert" size={16} />
                {error}
              </p>
            )}

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm" /> Entrando...
                </>
              ) : (
                <>
                  Entrar <Icon name="arrowRight" size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Ainda não tem conta? <Link to="/cadastro">Criar minha conta</Link>
          </p>

          <p className="auth-hint">
            <Icon name="info" size={14} />
            Use o usuário e a senha cadastrados no FitTrack.
          </p>

          <footer className="auth-legal-links">
            <Link to="/termos">Termos de Uso</Link>
            <span>·</span>
            <Link to="/privacidade">Privacidade</Link>
            <span>·</span>
            <Link to="/cookies">Cookies</Link>
          </footer>
        </div>
      </section>
    </div>
  )
}
