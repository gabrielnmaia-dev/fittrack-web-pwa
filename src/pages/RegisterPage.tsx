import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Icon from '../components/ui/Icon'
import { GOAL_LABELS, apiErrorMessage, evaluatePassword } from '../lib/format'
import type { Goal, ProfileInput } from '../api/types'

const goals: Goal[] = ['lose_weight', 'gain_muscle', 'maintain_weight']

export default function RegisterPage() {
  const { isAuthenticated, initializing, register } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [goal, setGoal] = useState<Goal>('maintain_weight')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!initializing && isAuthenticated) {
    return <Navigate to="/inicio" replace />
  }

  const strength = evaluatePassword(password)
  const passwordsMismatch = Boolean(confirm && password !== confirm)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não conferem.')
      return
    }

    if (!termsAccepted) {
      setError('Você precisa concordar com os Termos de Uso e a Política de Privacidade para criar sua conta.')
      return
    }

    const hasProfileData = Boolean(age || height || weight)
    if (hasProfileData && (!age || !height || !weight)) {
      setError('Preencha idade, altura e peso para completar o perfil.')
      return
    }

    const profile: ProfileInput | undefined = hasProfileData
      ? {
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          goal,
        }
      : undefined

    setLoading(true)
    try {
      await register({
        username: username.trim(),
        email: email.trim() || undefined,
        password,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        terms_accepted: true,
        profile,
      })
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível criar sua conta.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page-register">
      <section className="auth-showcase register-showcase">
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
          <span className="eyebrow">Comece hoje</span>
          <h1>
            Um plano
            <br />
            que cabe
            <br />
            <em>na sua rotina.</em>
          </h1>
          <p>
            Crie sua conta em menos de um minuto. Monte treinos, organize refeições e
            acompanhe tudo em um só lugar.
          </p>
        </div>

        <ul className="register-benefits">
          <li>
            <span>
              <Icon name="dumbbell" size={17} />
            </span>
            Planos de treino personalizados
          </li>
          <li>
            <span>
              <Icon name="bowl" size={17} />
            </span>
            Dietas e refeições organizadas
          </li>
          <li>
            <span>
              <Icon name="chart" size={17} />
            </span>
            Visão clara do seu progresso
          </li>
        </ul>

        <div className="auth-showcase-footer">
          <span>
            <Icon name="shield" size={15} /> Privado por padrão
          </span>
          <span className="auth-dots" aria-hidden="true">
            <i />
            <i className="active" />
            <i />
          </span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap auth-form-wrap-wide">
          <Link to="/login" className="back-link">
            <Icon name="arrowLeft" size={16} /> Voltar para o login
          </Link>

          <header className="auth-form-header">
            <span className="eyebrow">Nova conta</span>
            <h2>Crie seu espaço</h2>
            <p>Leva menos de um minuto. Você pode ajustar tudo depois.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field-row field-row-2">
              <label className="field">
                <span>Nome</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  placeholder="Gabriel"
                />
              </label>
              <label className="field">
                <span>Sobrenome</span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  placeholder="Silva"
                />
              </label>
            </div>

            <label className="field">
              <span>Usuário</span>
              <div className="input-shell">
                <Icon name="at" size={17} />
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
              <span>E-mail</span>
              <div className="input-shell">
                <Icon name="mail" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="voce@email.com"
                />
              </div>
            </label>

            <div className="field-row field-row-2">
              <label className="field">
                <span>Senha</span>
                <div className="input-shell">
                  <Icon name="lock" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    minLength={8}
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
              <label className="field">
                <span>Confirmar senha</span>
                <div className="input-shell">
                  <Icon name="lock" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    minLength={8}
                    aria-invalid={passwordsMismatch || undefined}
                    required
                  />
                </div>
              </label>
            </div>

            {password && (
              <div className={`password-meter tone-${strength.tone}`} aria-live="polite">
                <div className="password-meter-bars" aria-hidden="true">
                  {[1, 2, 3, 4].map((step) => (
                    <span key={step} className={strength.score >= step ? 'filled' : ''} />
                  ))}
                </div>
                <div className="password-meter-meta">
                  <span>
                    Força da senha: <strong>{strength.label}</strong>
                  </span>
                  {confirm && (
                    <span className={passwordsMismatch ? 'mismatch' : 'match'}>
                      {passwordsMismatch ? 'Senhas diferentes' : 'Senhas conferem'}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="optional-profile">
              <div className="optional-profile-head">
                <span className="optional-badge">Opcional</span>
                <div>
                  <strong>Seus dados físicos</strong>
                  <p>Usamos para personalizar metas e calcular seu IMC.</p>
                </div>
              </div>

              <div className="field-row field-row-3">
                <label className="field">
                  <span>Idade</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="28"
                  />
                </label>
                <label className="field">
                  <span>Altura (cm)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={30}
                    max={300}
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    placeholder="178"
                  />
                </label>
                <label className="field">
                  <span>Peso (kg)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={500}
                    step="0.1"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="75"
                  />
                </label>
              </div>

              <div className="goal-options">
                {goals.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`goal-option ${goal === value ? 'active' : ''}`}
                    onClick={() => setGoal(value)}
                    aria-pressed={goal === value}
                  >
                    <span className="goal-option-icon">
                      <Icon
                        name={
                          value === 'lose_weight'
                            ? 'flame'
                            : value === 'gain_muscle'
                              ? 'dumbbell'
                              : 'target'
                        }
                        size={17}
                      />
                    </span>
                    {GOAL_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                <Icon name="alert" size={16} />
                {error}
              </p>
            )}

            <label className="auth-terms-checkbox">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span>
                Li e concordo com os{' '}
                <Link to="/termos" target="_blank" rel="noopener noreferrer">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link to="/privacidade" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm" /> Criando conta...
                </>
              ) : (
                <>
                  Criar conta <Icon name="arrowRight" size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
