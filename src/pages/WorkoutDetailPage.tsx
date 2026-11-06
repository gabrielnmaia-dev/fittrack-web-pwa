import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteWorkoutPlan, getWorkoutPlan } from '../api/endpoints'
import { useToast } from '../components/ui/Toast'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Icon from '../components/ui/Icon'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import {
  apiErrorMessage,
  formatDate,
  formatNumber,
  levelLabel,
} from '../lib/format'

function getSessionKey(planId: number) {
  const today = new Date().toISOString().slice(0, 10)
  return `fittrack:workout-done:${planId}:${today}`
}

function loadCompletedExercises(planId: number): number[] {
  try {
    const raw = localStorage.getItem(getSessionKey(planId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : []
  } catch {
    return []
  }
}

export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const planId = Number(id)
  const invalidId = !Number.isInteger(planId) || planId <= 0

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [completedIds, setCompletedIds] = useState<number[]>(() =>
    invalidId ? [] : loadCompletedExercises(planId),
  )
  const [restSeconds, setRestSeconds] = useState(0)

  useEffect(() => {
    if (restSeconds <= 0) return
    const timer = window.setInterval(() => {
      setRestSeconds((current) => {
        if (current <= 1) {
          toast('Tempo de descanso finalizado! Próxima série.', 'info')
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [restSeconds, toast])

  const { data: plan, loading, error, reload } = useAsync(
    () => (invalidId ? Promise.reject(new Error('Treino inválido.')) : getWorkoutPlan(planId)),
    [planId, invalidId],
  )

  function toggleCompleted(exerciseId: number) {
    setCompletedIds((current) => {
      const next = current.includes(exerciseId)
        ? current.filter((item) => item !== exerciseId)
        : [...current, exerciseId]
      try {
        localStorage.setItem(getSessionKey(planId), JSON.stringify(next))
      } catch {
        /* ignore storage quota errors */
      }
      return next
    })
  }

  function resetSession() {
    setCompletedIds([])
    setRestSeconds(0)
    try {
      localStorage.removeItem(getSessionKey(planId))
    } catch {
      /* ignore */
    }
    toast('Progresso de hoje reiniciado.', 'info')
  }

  async function handleDelete() {
    if (!plan) return
    setDeleting(true)
    try {
      await deleteWorkoutPlan(plan.id)
      toast('Treino removido.', 'success')
      navigate('/treinos', { replace: true })
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível remover o treino.'), 'error')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) return <PageLoader label="Carregando treino..." />

  if (error || !plan) {
    return (
      <div className="stack">
        <Link to="/treinos" className="back-link">
          <Icon name="arrowLeft" size={16} /> Voltar para treinos
        </Link>
        <ErrorState
          message={invalidId ? 'O identificador desse treino é inválido.' : 'Não encontrei esse treino.'}
          onRetry={invalidId ? undefined : () => void reload()}
        />
      </div>
    )
  }

  const exercises = plan.exercise_details ?? []
  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0)
  const totalReps = exercises.reduce((sum, exercise) => sum + exercise.sets * exercise.reps, 0)
  const completedCount = exercises.filter((ex) => completedIds.includes(ex.id)).length
  const progressPercent =
    exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0
  const allCompleted = exercises.length > 0 && completedCount === exercises.length

  return (
    <div className="stack">
      <Link to="/treinos" className="back-link">
        <Icon name="arrowLeft" size={16} /> Voltar para treinos
      </Link>

      <section className={`detail-hero level-${plan.level}`}>
        <div className="detail-hero-glow" />
        <div className="detail-hero-content">
          <div className="detail-hero-badges">
            <span className={`level-badge ${plan.level}`}>{levelLabel(plan.level)}</span>
            <span className="soft-badge">
              <Icon name="calendar" size={14} /> Criado em {formatDate(plan.created_at)}
            </span>
          </div>

          <h1>{plan.name}</h1>
          <p>{plan.description || 'Sem descrição para este treino.'}</p>

          <div className="detail-hero-actions">
            <Link to={`/treinos/${plan.id}/editar`} className="btn btn-primary">
              <Icon name="edit" size={16} /> Editar treino
            </Link>
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => setRestSeconds((current) => (current > 0 ? 0 : 60))}
            >
              <Icon name="timer" size={16} />
              {restSeconds > 0 ? `Descanso: ${restSeconds}s (parar)` : 'Descanso 60s'}
            </button>
            <button
              type="button"
              className="btn btn-danger-ghost"
              onClick={() => setConfirmOpen(true)}
            >
              <Icon name="trash" size={16} /> Excluir
            </button>
          </div>
        </div>

        <div className="detail-hero-stats">
          <div>
            <span className="detail-stat-icon">
              <Icon name="clock" size={19} />
            </span>
            <strong>{plan.duration}</strong>
            <span>minutos</span>
          </div>
          <div>
            <span className="detail-stat-icon">
              <Icon name="dumbbell" size={19} />
            </span>
            <strong>{exercises.length}</strong>
            <span>exercícios</span>
          </div>
          <div>
            <span className="detail-stat-icon">
              <Icon name="list" size={19} />
            </span>
            <strong>{formatNumber(totalSets)}</strong>
            <span>séries</span>
          </div>
          <div>
            <span className="detail-stat-icon">
              <Icon name="activity" size={19} />
            </span>
            <strong>{formatNumber(totalReps)}</strong>
            <span>repetições</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Exercícios do treino</h2>
            <p>
              {exercises.length === 0
                ? 'Nenhum exercício adicionado'
                : `${completedCount} de ${exercises.length} concluídos hoje (${progressPercent}%) — toque para marcar`}
            </p>
          </div>
          <div className="panel-header-actions">
            {completedCount > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetSession}
                title="Reiniciar progresso de hoje"
              >
                <Icon name="rotateCcw" size={14} /> Reiniciar
              </button>
            )}
            <Link to={`/treinos/${plan.id}/editar`} className="panel-link">
              <Icon name="edit" size={15} /> Editar
            </Link>
          </div>
        </header>

        {exercises.length > 0 && (
          <div className="session-progress" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="session-progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}

        {allCompleted && (
          <div className="session-complete-banner" role="status">
            <span className="session-complete-icon">
              <Icon name="trophy" size={20} />
            </span>
            <div>
              <strong>Treino de hoje concluído!</strong>
              <p>Todos os {exercises.length} exercícios foram marcados como feitos.</p>
            </div>
          </div>
        )}

        {exercises.length === 0 ? (
          <div className="empty-state compact">
            <span className="empty-icon">
              <Icon name="activity" size={26} />
            </span>
            <h3>Treino sem exercícios</h3>
            <p>Edite o treino para escolher exercícios do seu catálogo.</p>
            <div className="empty-action">
              <Link to={`/treinos/${plan.id}/editar`} className="btn btn-primary btn-sm">
                <Icon name="plus" size={15} /> Adicionar exercícios
              </Link>
            </div>
          </div>
        ) : (
          <ol className="exercise-list">
            {exercises.map((exercise, index) => {
              const isDone = completedIds.includes(exercise.id)
              return (
                <li
                  key={exercise.id}
                  className={`exercise-item interactive ${isDone ? 'completed' : ''}`}
                >
                  <button
                    type="button"
                    className={`exercise-check-btn ${isDone ? 'checked' : ''}`}
                    onClick={() => toggleCompleted(exercise.id)}
                    aria-pressed={isDone}
                    aria-label={
                      isDone
                        ? `Desmarcar ${exercise.name} como concluído`
                        : `Marcar ${exercise.name} como concluído`
                    }
                  >
                    {isDone ? (
                      <Icon name="check" size={15} />
                    ) : (
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    )}
                  </button>
                  <div
                    className="exercise-item-copy"
                    onClick={() => toggleCompleted(exercise.id)}
                    role="button"
                    tabIndex={-1}
                  >
                    <div className="exercise-item-title">
                      <h3>{exercise.name}</h3>
                      <span className="soft-badge">{exercise.muscle_group}</span>
                      {exercise.is_global && <span className="soft-badge global">Global</span>}
                    </div>
                    {exercise.description && <p>{exercise.description}</p>}
                  </div>
                  <div className="exercise-prescription">
                    <strong>
                      {exercise.sets}
                      <span>×</span>
                      {exercise.reps}
                    </strong>
                    <small>séries × reps</small>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir treino?"
        description={`"${plan.name}" será desativado e sairá da sua lista. Você pode recriá-lo quando quiser.`}
        confirmLabel="Excluir treino"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
