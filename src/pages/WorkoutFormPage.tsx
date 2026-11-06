import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createWorkoutPlan,
  getExercises,
  getWorkoutPlan,
  updateWorkoutPlan,
} from '../api/endpoints'
import type { Exercise, WorkoutLevel, WorkoutPlan } from '../api/types'
import ExerciseFormModal from '../components/forms/ExerciseFormModal'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { useAsync, useDebouncedValue } from '../hooks/useAsync'
import {
  LEVEL_LABELS,
  LEVEL_ORDER,
  MUSCLE_GROUPS,
  apiErrorMessage,
  levelLabel,
} from '../lib/format'

const durationPresets = ['30', '45', '60', '75', '90']

const levelHints: Record<WorkoutLevel, string> = {
  beginner: 'Ideal para começar e criar consistência.',
  intermediate: 'Para quem já treina com regularidade.',
  advanced: 'Alta intensidade e maior volume de treino.',
}

export default function WorkoutFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isEditing = Boolean(id)
  const planId = Number(id)
  const invalidId = isEditing && (!Number.isInteger(planId) || planId <= 0)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('45')
  const [level, setLevel] = useState<WorkoutLevel>('intermediate')
  const [selected, setSelected] = useState<number[]>([])
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogGroup, setCatalogGroup] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false)

  const debouncedCatalogSearch = useDebouncedValue(catalogSearch, 200)

  const planState = useAsync(
    () => (isEditing && !invalidId ? getWorkoutPlan(planId) : Promise.resolve(null)),
    [isEditing, planId, invalidId],
  )

  const catalog = useAsync(
    () => getExercises({ pageSize: 100, ordering: 'name' }),
    [],
  )

  const plan = planState.data as WorkoutPlan | null

  // Hidrata o formulário a partir do treino carregado assincronamente. Isso só
  // acontece quando o plano chega da API; o estado inicial do formulário é
  // montado antes do plano estar disponível, então um useState initializer não
  // seria re-executado. Sincronizar dados assíncronos no estado do formulário
  // exige esse efeito.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!plan) return
    setName(plan.name)
    setDescription(plan.description)
    setDuration(String(plan.duration))
    setLevel(plan.level)
    setSelected(plan.exercises)
  }, [plan])
  /* eslint-enable react-hooks/set-state-in-effect */

  const exerciseMap = useMemo(() => {
    const map = new Map<number, Exercise>()
    plan?.exercise_details.forEach((exercise) => map.set(exercise.id, exercise))
    catalog.data?.results.forEach((exercise) => map.set(exercise.id, exercise))
    return map
  }, [plan, catalog.data])

  const filteredCatalog = useMemo(() => {
    const query = debouncedCatalogSearch.trim().toLowerCase()
    const exercises = catalog.data?.results ?? []
    return exercises.filter((exercise) => {
      if (catalogGroup && exercise.muscle_group !== catalogGroup) return false
      if (!query) return true
      return `${exercise.name} ${exercise.muscle_group} ${exercise.description}`
        .toLowerCase()
        .includes(query)
    })
  }, [catalog.data, debouncedCatalogSearch, catalogGroup])

  const selectedExercises = selected
    .map((exerciseId) => exerciseMap.get(exerciseId))
    .filter((exercise): exercise is Exercise => Boolean(exercise))

  function toggleExercise(exerciseId: number) {
    setSelected((current) =>
      current.includes(exerciseId)
        ? current.filter((entry) => entry !== exerciseId)
        : [...current, exerciseId],
    )
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setSelected((current) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= current.length) return current
      const next = [...current]
      const [moved] = next.splice(index, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
  }

  function handleExerciseCreated(exercise: Exercise) {
    catalog.setData({
      count: (catalog.data?.count ?? 0) + 1,
      next: null,
      previous: null,
      results: [exercise, ...(catalog.data?.results ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    })
    setSelected((current) =>
      current.includes(exercise.id) ? current : [...current, exercise.id],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsedDuration = Number(duration)
    if (!name.trim()) {
      setError('Dê um nome para o treino.')
      return
    }
    if (!Number.isFinite(parsedDuration) || parsedDuration < 1) {
      setError('A duração precisa ser de pelo menos 1 minuto.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        duration: parsedDuration,
        level,
        exercises: selected,
      }

      const saved = isEditing
        ? await updateWorkoutPlan(planId, payload)
        : await createWorkoutPlan(payload)

      toast(isEditing ? 'Treino atualizado.' : 'Treino criado com sucesso.', 'success')
      navigate(`/treinos/${saved.id}`, { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível salvar o treino.'))
    } finally {
      setSaving(false)
    }
  }

  if (isEditing) {
    if (invalidId) {
      return <ErrorState message="O identificador desse treino é inválido." />
    }
    if (planState.loading) return <PageLoader label="Carregando treino..." />
    if (planState.error || !plan) {
      return (
        <ErrorState
          message={planState.error ?? 'Treino não encontrado.'}
          onRetry={() => void planState.reload()}
        />
      )
    }
  }

  return (
    <div className="stack-lg">
      <Link to={isEditing ? `/treinos/${planId}` : '/treinos'} className="back-link">
        <Icon name="arrowLeft" size={16} /> {isEditing ? 'Voltar ao treino' : 'Voltar para treinos'}
      </Link>

      <PageHeader
        eyebrow={isEditing ? 'Ajuste seu plano' : 'Novo plano'}
        title={isEditing ? 'Editar treino' : 'Montar novo treino'}
        description="Defina o ritmo do treino e escolha os exercícios do seu catálogo."
      />

      <form className="workout-form-layout" onSubmit={handleSubmit}>
        <div className="stack-lg">
          <section className="panel form-section">
            <header className="form-section-head">
              <span className="form-step">01</span>
              <div>
                <h2>Informações básicas</h2>
                <p>Como você quer chamar e organizar este treino?</p>
              </div>
            </header>

            <div className="form">
              <label className="field">
                <span>Nome do treino</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Treino A — Peito e tríceps"
                  required
                />
              </label>

              <label className="field">
                <span>Descrição</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Foco do treino, observações, progressão..."
                  rows={3}
                  required
                />
              </label>

              <div className="field-row field-row-2">
                <label className="field">
                  <span>Duração estimada (min)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={600}
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    required
                  />
                </label>
                <div className="field">
                  <span>Intensidade</span>
                  <div className="level-current">
                    <span className={`level-badge ${level}`}>{levelLabel(level)}</span>
                    <small>{levelHints[level]}</small>
                  </div>
                </div>
              </div>

              <div className="preset-chips" role="group" aria-label="Durações rápidas">
                {durationPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`chip ${duration === preset ? 'active' : ''}`}
                    onClick={() => setDuration(preset)}
                  >
                    {preset} min
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel form-section">
            <header className="form-section-head">
              <span className="form-step">02</span>
              <div>
                <h2>Nível do treino</h2>
                <p>Escolha a intensidade que combina com o seu momento.</p>
              </div>
            </header>

            <div className="level-options">
              {LEVEL_ORDER.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`level-option ${level === value ? 'active' : ''}`}
                  onClick={() => setLevel(value)}
                  aria-pressed={level === value}
                >
                  <span className={`level-option-icon ${value}`}>
                    <Icon
                      name={value === 'beginner' ? 'leaf' : value === 'intermediate' ? 'activity' : 'flame'}
                      size={20}
                    />
                  </span>
                  <strong>{LEVEL_LABELS[value]}</strong>
                  <small>{levelHints[value]}</small>
                  <span className="level-option-check">
                    <Icon name="check" size={14} />
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel form-section">
            <header className="form-section-head">
              <span className="form-step">03</span>
              <div>
                <h2>Exercícios</h2>
                <p>Selecione do catálogo ou crie um novo exercício.</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setExerciseModalOpen(true)}
              >
                <Icon name="plus" size={15} /> Criar exercício
              </button>
            </header>

            <div className="exercise-picker">
              <SearchInput
                value={catalogSearch}
                onChange={setCatalogSearch}
                placeholder="Buscar por nome ou grupo muscular..."
                enableShortcut={false}
              />

              <div className="filter-chips picker-group-chips" role="group" aria-label="Filtrar catálogo por grupo muscular">
                <button
                  type="button"
                  className={`chip ${catalogGroup === '' ? 'active' : ''}`}
                  onClick={() => setCatalogGroup('')}
                >
                  Todos
                </button>
                {MUSCLE_GROUPS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    className={`chip ${catalogGroup === group ? 'active' : ''}`}
                    onClick={() => setCatalogGroup(catalogGroup === group ? '' : group)}
                  >
                    {group}
                  </button>
                ))}
              </div>

              {catalog.loading ? (
                <div className="picker-loading">
                  <span className="spinner" /> Carregando catálogo...
                </div>
              ) : catalog.error ? (
                <div className="picker-empty">
                  <p>{catalog.error}</p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => void catalog.reload()}
                  >
                    <Icon name="refresh" size={15} /> Tentar de novo
                  </button>
                </div>
              ) : filteredCatalog.length === 0 ? (
                <div className="picker-empty">
                  <p>Nenhum exercício encontrado.</p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setExerciseModalOpen(true)}
                  >
                    <Icon name="plus" size={15} /> Criar &quot;{catalogSearch}&quot;
                  </button>
                </div>
              ) : (
                <div className="picker-list">
                  {filteredCatalog.map((exercise) => {
                    const isSelected = selected.includes(exercise.id)
                    return (
                      <button
                        type="button"
                        key={exercise.id}
                        className={`picker-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleExercise(exercise.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="picker-check">
                          {isSelected && <Icon name="check" size={14} />}
                        </span>
                        <span className="picker-item-copy">
                          <strong>{exercise.name}</strong>
                          <span>
                            {exercise.muscle_group} · {exercise.sets}×{exercise.reps}
                          </span>
                        </span>
                        {exercise.is_global && <span className="soft-badge global">Global</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          {error && (
            <p className="form-error" role="alert">
              <Icon name="alert" size={16} /> {error}
            </p>
          )}
        </div>

        <aside className="form-aside">
          <div className="summary-card">
            <header className="summary-head">
              <span className="summary-icon">
                <Icon name="dumbbell" size={20} />
              </span>
              <div>
                <strong>Resumo do treino</strong>
                <span>Confira antes de salvar</span>
              </div>
            </header>

            <div className="summary-stats">
              <div>
                <span>Duração</span>
                <strong>{duration || '0'} min</strong>
              </div>
              <div>
                <span>Nível</span>
                <strong>{levelLabel(level)}</strong>
              </div>
              <div>
                <span>Exercícios</span>
                <strong>{selected.length}</strong>
              </div>
            </div>

            <div className="summary-selected">
              <div className="summary-selected-head">
                <span className="summary-label">Selecionados ({selectedExercises.length})</span>
                {selectedExercises.length > 0 && (
                  <button
                    type="button"
                    className="summary-clear-btn"
                    onClick={() => setSelected([])}
                  >
                    Limpar
                  </button>
                )}
              </div>
              {selectedExercises.length === 0 ? (
                <p className="summary-empty">
                  Nenhum exercício selecionado ainda. Escolha ao lado para montar o treino.
                </p>
              ) : (
                <ul>
                  {selectedExercises.map((exercise, index) => (
                    <li key={exercise.id}>
                      <span className="summary-order">{index + 1}</span>
                      <div>
                        <strong>{exercise.name}</strong>
                        <span>
                          {exercise.sets}×{exercise.reps} · {exercise.muscle_group}
                        </span>
                      </div>
                      <div className="summary-item-actions">
                        <button
                          type="button"
                          className="icon-btn subtle"
                          onClick={() => moveExercise(index, -1)}
                          disabled={index === 0}
                          aria-label={`Mover ${exercise.name} para cima`}
                          title="Mover para cima"
                        >
                          <Icon name="chevronUp" size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn subtle"
                          onClick={() => moveExercise(index, 1)}
                          disabled={index === selectedExercises.length - 1}
                          aria-label={`Mover ${exercise.name} para baixo`}
                          title="Mover para baixo"
                        >
                          <Icon name="chevronDown" size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn subtle danger"
                          onClick={() => toggleExercise(exercise.id)}
                          aria-label={`Remover ${exercise.name}`}
                          title="Remover"
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner spinner-sm" /> Salvando...
                </>
              ) : (
                <>
                  <Icon name="check" size={17} /> {isEditing ? 'Salvar alterações' : 'Criar treino'}
                </>
              )}
            </button>
          </div>
        </aside>
      </form>

      <ExerciseFormModal
        open={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        onSaved={handleExerciseCreated}
      />
    </div>
  )
}
