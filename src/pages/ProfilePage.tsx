import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteAccount, exportUserData, getMyTermsAcceptance, updateMe } from '../api/endpoints'
import type { Goal, UpdateMeInput, UserTermsAcceptanceStatus } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import ConfirmDialog from '../components/ui/ConfirmDialog'
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

  // LGPD e Privacidade
  const [termsStatus, setTermsStatus] = useState<UserTermsAcceptanceStatus | null>(null)
  const [exporting, setExporting] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    let active = true
    getMyTermsAcceptance()
      .then((status) => {
        if (active) setTermsStatus(status)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  async function handleExportData() {
    setExporting(true)
    try {
      const data = await exportUserData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json;charset=utf-8',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fittrack_dados_${user?.username || 'usuario'}_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast('Relatório exportado em formato JSON.', 'success')
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível exportar seus dados.'), 'error')
    } finally {
      setExporting(false)
    }
  }

  async function handleConfirmDelete() {
    setDeletingAccount(true)
    try {
      await deleteAccount('Encerramento e exclusão solicitados pelo titular.')
      toast('Sua conta foi desativada e anonimizada com sucesso.', 'info')
      logout()
      navigate('/login', { replace: true })
    } catch (err) {
      toast(apiErrorMessage(err, 'Erro ao solicitar exclusão de conta.'), 'error')
      setDeletingAccount(false)
      setConfirmDeleteOpen(false)
    }
  }

  function handleOpenCookieSettings() {
    window.dispatchEvent(new CustomEvent('fittrack:open-cookie-banner'))
  }

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
              <h2>Privacidade e Proteção de Dados (LGPD)</h2>
              <p>Gerencie seus dados pessoais, termos aceitos e direitos de titular.</p>
            </div>
            <span className="panel-icon">
              <Icon name="shield" size={19} />
            </span>
          </header>

          <div className="privacy-profile-body">
            <div className="privacy-status-card">
              <div className="privacy-status-info">
                <strong>Termos de Uso e Política de Privacidade</strong>
                <p>
                  {termsStatus?.has_accepted_current ? (
                    <span className="text-success">
                      ✓ Aceite registrado na versão <strong>v{termsStatus.current_version}</strong>
                      {termsStatus.latest_acceptance?.accepted_at && (
                        <> em {formatDate(termsStatus.latest_acceptance.accepted_at)}</>
                      )}
                    </span>
                  ) : (
                    <span className="text-warning">
                      Aguardando confirmação da versão v{termsStatus?.current_version || '1.0'}
                    </span>
                  )}
                </p>
              </div>
              <div className="privacy-links-inline">
                <Link to="/termos" className="btn btn-ghost btn-xs">Termos</Link>
                <Link to="/privacidade" className="btn btn-ghost btn-xs">Privacidade</Link>
                <Link to="/cookies" className="btn btn-ghost btn-xs">Cookies</Link>
              </div>
            </div>

            <div className="privacy-actions-grid">
              <button
                type="button"
                className="settings-link"
                onClick={handleExportData}
                disabled={exporting}
              >
                <span className="settings-link-icon">
                  <Icon name="download" size={18} />
                </span>
                <span>
                  <strong>Exportar Meus Dados (Portabilidade)</strong>
                  <small>Baixar relatório JSON com todos os seus dados cadastrais, treinos e dietas</small>
                </span>
                {exporting ? <span className="spinner spinner-sm" /> : <Icon name="chevronRight" size={17} />}
              </button>

              <button
                type="button"
                className="settings-link"
                onClick={handleOpenCookieSettings}
              >
                <span className="settings-link-icon">
                  <Icon name="filter" size={18} />
                </span>
                <span>
                  <strong>Preferências de Cookies e Armazenamento</strong>
                  <small>Personalize escolhas de armazenamento local e tecnologias opcionais</small>
                </span>
                <Icon name="chevronRight" size={17} />
              </button>

              <button
                type="button"
                className="settings-link danger"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <span className="settings-link-icon">
                  <Icon name="trash" size={18} />
                </span>
                <span>
                  <strong>Excluir Minha Conta e Dados</strong>
                  <small>Desativação permanente e anonimização dos seus dados pessoais</small>
                </span>
                <Icon name="chevronRight" size={17} />
              </button>
            </div>
          </div>
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

        <ConfirmDialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Excluir Conta e Dados Pessoais"
          description="Tem certeza que deseja solicitar o encerramento da sua conta? Seus dados cadastrais e perfil físico serão desativados e anonimizados. Em cumprimento ao Marco Civil da Internet (Art. 15), logs de conexão serão mantidos sob sigilo judicial pelo prazo legal de 6 meses."
          confirmLabel="Excluir Minha Conta"
          loading={deletingAccount}
        />
      </div>
    </div>
  )
}
