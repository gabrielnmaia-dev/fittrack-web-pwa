import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { deleteExercise, getExercises } from '../api/endpoints'
import type { Exercise } from '../api/types'
import ExerciseFormModal from '../components/forms/ExerciseFormModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import { EmptyState, ErrorState, SkeletonCards } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../auth/AuthContext'
import { useAsync, useDebouncedValue } from '../hooks/useAsync'
import { MUSCLE_GROUPS, apiErrorMessage, formatNumber } from '../lib/format'

const PAGE_SIZE = 12

const sorts = [
  { value: 'name', label: 'Nome (A–Z)' },
  { value: '-created_at', label: 'Mais recentes' },
  { value: 'muscle_group', label: 'Grupo muscular' },
]

export default function ExercisesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('')
  const [ordering, setOrdering] = useState('name')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [deletingExercise, setDeletingExercise] = useState<Exercise | null>(null)
  const [deleting, setDeleting] = useState(false)

  const debouncedSearch = useDebouncedValue(search)

  // Quando chegar por um link "/exercicios?novo=1", abrimos o modal de criação
  // direto na renderização (sem efeito), e limpamos o parâmetro ao fechar.
  const novo = searchParams.get('novo') === '1'

  const { data, loading, error, reload, setData } = useAsync(
    () =>
      getExercises({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        muscleGroup: muscleGroup || undefined,
        ordering,
      }),
    [page, debouncedSearch, muscleGroup, ordering],
  )

  function canManage(exercise: Exercise) {
    return Boolean(user?.is_staff) || (!exercise.is_global && exercise.user === user?.id)
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(exercise: Exercise) {
    setEditing(exercise)
    setModalOpen(true)
  }

  function handleSaved(saved: Exercise) {
    if (!data) {
      void reload()
      return
    }
    const exists = data.results.some((item) => item.id === saved.id)
    setData({
      ...data,
      count: exists ? data.count : data.count + 1,
      results: exists
        ? data.results.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...data.results],
    })
  }

  async function handleDelete() {
    if (!deletingExercise) return
    setDeleting(true)
    try {
      await deleteExercise(deletingExercise.id)
      toast('Exercício removido.', 'success')
      setDeletingExercise(null)
      void reload(true)
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível remover o exercício.'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const hasFilters = Boolean(debouncedSearch || muscleGroup)
  const results = data?.results ?? []

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Catálogo de movimentos"
        title="Exercícios"
        description="Use o catálogo global ou crie seus próprios exercícios com séries e repetições."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <Icon name="plus" size={17} /> Novo exercício
          </button>
        }
      />

      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Buscar por nome ou grupo..."
        />

        <div className="toolbar-controls">
          <label className="select-shell">
            <Icon name="activity" size={15} />
            <select
              value={muscleGroup}
              onChange={(event) => {
                setMuscleGroup(event.target.value)
                setPage(1)
              }}
              aria-label="Filtrar por grupo muscular"
            >
              <option value="">Todos os grupos</option>
              {MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>

          <label className="select-shell">
            <Icon name="filter" size={15} />
            <select
              value={ordering}
              onChange={(event) => {
                setOrdering(event.target.value)
                setPage(1)
              }}
              aria-label="Ordenar exercícios"
            >
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <SkeletonCards count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : results.length === 0 ? (
        <EmptyState
          icon="activity"
          title={hasFilters ? 'Nenhum exercício encontrado' : 'Seu catálogo está vazio'}
          description={
            hasFilters
              ? 'Tente outro termo ou remova o filtro de grupo muscular.'
              : 'Crie exercícios com séries e repetições para usar nos seus treinos.'
          }
          action={
            hasFilters ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSearch('')
                  setMuscleGroup('')
                }}
              >
                <Icon name="refresh" size={16} /> Limpar filtros
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Icon name="plus" size={17} /> Criar exercício
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="results-line">
            <span>
              {formatNumber(data?.count ?? 0)}{' '}
              {(data?.count ?? 0) === 1 ? 'exercício' : 'exercícios'}
            </span>
            <span className="results-line-hint">
              O catálogo global é compartilhado; seus exercícios são privados.
            </span>
          </div>

          <div className="exercise-grid">
            {results.map((exercise) => (
              <article key={exercise.id} className="exercise-card">
                <div className="exercise-card-top">
                  <span className="exercise-card-icon">
                    <Icon
                      name={exercise.muscle_group === 'Cardio' ? 'flame' : 'dumbbell'}
                      size={21}
                    />
                  </span>
                  <div className="exercise-card-badges">
                    <span className="soft-badge">{exercise.muscle_group}</span>
                    {exercise.is_global ? (
                      <span className="soft-badge global">Global</span>
                    ) : (
                      <span className="soft-badge private">Meu</span>
                    )}
                  </div>
                </div>

                <h3>{exercise.name}</h3>
                <p>{exercise.description || 'Sem descrição.'}</p>

                <div className="exercise-card-footer">
                  <span className="exercise-prescription-pill">
                    <strong>{exercise.sets}</strong> séries
                    <i>×</i>
                    <strong>{exercise.reps}</strong> reps
                  </span>

                  {canManage(exercise) && (
                    <div className="card-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => openEdit(exercise)}
                        aria-label={`Editar ${exercise.name}`}
                        title="Editar"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => setDeletingExercise(exercise)}
                        aria-label={`Excluir ${exercise.name}`}
                        title="Excluir"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Pagination
            page={page}
            count={data?.count ?? 0}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}

      <ExerciseFormModal
        open={modalOpen || novo}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
          void setSearchParams({}, { replace: true })
        }}
        exercise={novo ? undefined : editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deletingExercise)}
        title="Excluir exercício?"
        description={`"${deletingExercise?.name ?? ''}" será desativado. Os treinos que usam esse exercício não serão apagados.`}
        confirmLabel="Excluir exercício"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingExercise(null)}
      />
    </div>
  )
}
