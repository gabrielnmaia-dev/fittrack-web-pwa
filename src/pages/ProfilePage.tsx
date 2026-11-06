import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateMe } from '../api/endpoints'
import type { Goal, UpdateMeInput } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { ThemeToggle } from '../components/ThemeToggle'
import { useTheme } from '../theme/ThemeContext'
import {
  GOAL_LABELS,
  apiErrorMessage,
  bmi,
  bmiLabel,
  displayName,
  evaluatePassword,
  formatDate,
  goalLabel,
  initials,
} from '../lib/format'

const goals: Goal[] = ['lose_weight', 'gain_muscle', 'maintain_weight']

const goalIcons: Record<Goal, 'flame' | 'dumbbell' | 'target'> = {
  lose_weight: 'flame',
  gain_muscle: 'dumbbell',
  maintain_weight: 'target',
}

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const { toast } = useToast()
  const { mode } = useTheme()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(user?.first_name ?? '')
  const [lastName, setLastName] = useState(user?.last_name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  const [age, setAge] = useState(user?.profile?.age ? String(user.profile.age) : '')
  const [height, setHeight] = useState(user?.profile?.height ? String(user.profile.height) : '')
  const [weight, setWeight] = useState(user?.profile?.weight ? String(user.profile.weight) : '')
  const [goal, setGoal] = useState<Goal>(user?.profile?.goal ?? 'maintain_weight')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const liveBmi = bmi(Number(weight) || null, Number(height) || null)
  const profileComplete = Boolean(user.profile)
  const strength = evaluatePassword(password)
  const passwordsMismatch = Boolean(confirmPassword && password !== confirmPassword)

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const hasProfileData = Boolean(age || height || weight)
    const needsProfile = hasProfileData || Boolean(user?.profile)
    if (needsProfile && (!age || !height || !weight)) {
      setError('Preencha idade, altura e peso para salvar seus dados físicos.')
      return
    }

    const payload: UpdateMeInput = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
    }

    if (needsProfile) {
      payload.profile = {
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        goal,
      }
    }

    setSaving(true)
    try {
      const updated = await updateMe(payload)
      setUser(updated)
      toast('Perfil atualizado.', 'success')
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível salvar o perfil.'))
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A nova senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    setSavingPassword(true)
    try {
      const updated = await updateMe({ password })
      setUser(updated)
      setPassword('')
      setConfirmPassword('')
      toast('Senha atualizada.', 'success')
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível atualizar a senha.'))
    } finally {
      setSavingPassword(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Sua conta"
        title="Perfil"
        description="Mantenha seus dados em dia para acompanhar seu progresso com precisão."
      />

      <section className="profile-hero">
        <div className="profile-hero-glow" />
        <div className="profile-hero-main">
          <span className="avatar avatar-xl">{initials(displayName(user))}</span>
          <div className="profile-hero-copy">
            <div className="profile-hero-title">
              <h2>{displayName(user)}</h2>
              {user.is_staff && (
                <span className="soft-badge staff">
                  <Icon name="shield" size={13} /> Staff
                </span>
              )}
            </div>
            <p>@{user.username}</p>
            <div className="profile-hero-badges">
              <span className="soft-badge green">
                <Icon name="target" size={13} /> {goalLabel(user.profile?.goal)}
              </span>
              <span className="soft-badge">
                <Icon name="calendar" size={13} /> Desde {formatDate(user.date_joined)}
              </span>
              <span className={`soft-badge ${profileComplete ? 'green' : 'orange'}`}>
                <Icon name={profileComplete ? 'check' : 'info'} size={13} />
                {profileComplete ? 'Perfil completo' : 'Complete seu perfil'}
              </span>
            </div>
          </div>

          <div className="profile-hero-metrics">
            <div>
              <span>Peso</span>
              <strong>{user.profile ? `${user.profile.weight} kg` : '—'}</strong>
            </div>
            <div>
              <span>Altura</span>
              <strong>{user.profile ? `${user.profile.height} cm` : '—'}</strong>
            </div>
            <div>
              <span>IMC</span>
              <strong>{liveBmi ?? '—'}</strong>
              <small>{bmiLabel(liveBmi)}</small>
            </div>
          </div>
        </div>
      </section>

      <form className="profile-layout" onSubmit={handleProfileSubmit}>
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Dados da conta</h2>
              <p>Como você aparece no FitTrack</p>
            </div>
            <span className="panel-icon">
              <Icon name="user" size={19} />
            </span>
          </header>

          <div className="form">
            <div className="field-row field-row-2">
              <label className="field">
                <span>Nome</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  placeholder="Seu nome"
                />
              </label>
              <label className="field">
                <span>Sobrenome</span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  placeholder="Seu sobrenome"
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
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Dados físicos</h2>
              <p>Usados para calcular seu IMC</p>
            </div>
            <span className="panel-icon">
              <Icon name="scale" size={19} />
            </span>
          </header>

          <div className="form">
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

            <div className="field">
              <span>Objetivo</span>
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
                      <Icon name={goalIcons[value]} size={17} />
                    </span>
                    {GOAL_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={16} /> {error}
          </p>
        )}

        <div className="profile-form-footer">
          <span className="muted">As alterações valem para sua conta e seus planos.</span>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner spinner-sm" /> Salvando...
              </>
            ) : (
              <>
                <Icon name="check" size={17} /> Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>

      <div className="profile-columns">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Segurança</h2>
              <p>Troque sua senha de acesso</p>
            </div>
            <span className="panel-icon">
              <Icon name="lock" size={19} />
            </span>
          </header>

          <form className="form" onSubmit={handlePasswordSubmit}>
            <label className="field">
              <span>Nova senha</span>
              <div className="input-shell">
                <Icon name="lock" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
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
              <span>Confirmar nova senha</span>
              <div className="input-shell">
                <Icon name="lock" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Repita a nova senha"
                  minLength={8}
                  aria-invalid={passwordsMismatch || undefined}
                  required
                />
              </div>
            </label>

            {password && (
              <div className={`password-meter tone-${strength.tone}`} aria-live="polite">
                <div className="password-meter-bars" aria-hidden="true">
                  {[1, 2, 3, 4].map((step) => (
                    <span key={step} className={strength.score >= step ? 'filled' : ''} />
                  ))}
                </div>
                <div className="password-meter-meta">
                  <span>
                    Força: <strong>{strength.label}</strong>
                  </span>
                  {confirmPassword && (
                    <span className={passwordsMismatch ? 'mismatch' : 'match'}>
                      {passwordsMismatch ? 'Senhas diferentes' : 'Senhas conferem'}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button className="btn btn-soft btn-block" type="submit" disabled={savingPassword}>
              {savingPassword ? (
                <>
                  <span className="spinner spinner-sm" /> Atualizando...
                </>
              ) : (
                <>
                  <Icon name="shield" size={16} /> Atualizar senha
                </>
              )}
            </button>
          </form>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Aparência</h2>
              <p>Modo atual: {mode === 'system' ? 'sistema' : mode === 'dark' ? 'escuro' : 'claro'}</p>
            </div>
            <span className="panel-icon">
              <Icon name={mode === 'dark' ? 'moon' : mode === 'light' ? 'sun' : 'monitor'} size={19} />
            </span>
          </header>

          <div className="appearance-body">
            <p>Escolha como o FitTrack deve aparecer no seu dispositivo.</p>
            <ThemeToggle />
          </div>

          {user.is_staff && (
            <Link to="/usuarios" className="settings-link">
              <span className="settings-link-icon">
                <Icon name="users" size={18} />
              </span>
              <span>
                <strong>Gerenciar usuários</strong>
                <small>Área restrita para staff</small>
              </span>
              <Icon name="chevronRight" size={17} />
            </Link>
          )}

          <button type="button" className="settings-link danger" onClick={handleLogout}>
            <span className="settings-link-icon">
              <Icon name="logout" size={18} />
            </span>
            <span>
              <strong>Sair da conta</strong>
              <small>Encerrar a sessão neste dispositivo</small>
            </span>
            <Icon name="chevronRight" size={17} />
          </button>
        </section>
      </div>
    </div>
  )
}
