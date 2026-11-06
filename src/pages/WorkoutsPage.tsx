import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorkoutPlans } from '../api/endpoints'
import type { WorkoutLevel } from '../api/types'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import { EmptyState, ErrorState, SkeletonCards } from '../components/ui/States'
import { useAsync, useDebouncedValue } from '../hooks/useAsync'
import { LEVEL_LABELS, LEVEL_ORDER, formatShortDate, levelLabel } from '../lib/format'

const PAGE_SIZE = 9

const sorts = [
  { value: '-created_at', label: 'Mais recentes' },
  { value: 'name', label: 'Nome (A–Z)' },
  { value: '-duration', label: 'Maior duração' },
]

export default function WorkoutsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<WorkoutLevel | ''>('')
  const [ordering, setOrdering] = useState('-created_at')

  const debouncedSearch = useDebouncedValue(search)

  const { data, loading, error, reload } = useAsync(
    () =>
      getWorkoutPlans({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        level: level || undefined,
        ordering,
      }),
    [page, debouncedSearch, level, ordering],
  )

  const results = useMemo(() => data?.results ?? [], [data])
  const hasFilters = Boolean(debouncedSearch || level)

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function changeLevel(value: WorkoutLevel | '') {
    setLevel(value)
    setPage(1)
  }

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Sua rotina de força"
        title="Meus treinos"
        description="Organize seus planos, exercícios, séries e cargas em um só lugar."
        actions={
          <Link to="/treinos/novo" className="btn btn-primary">
            <Icon name="plus" size={17} /> Novo treino
          </Link>
        }
      />

      <div className="toolbar">
        <SearchInput value={search} onChange={changeSearch} placeholder="Buscar treino..." />

        <div className="toolbar-controls">
          <div className="filter-chips" role="group" aria-label="Filtrar por nível">
            <button
              type="button"
              className={`chip ${level === '' ? 'active' : ''}`}
              onClick={() => changeLevel('')}
            >
              Todos
            </button>
            {LEVEL_ORDER.map((value) => (
              <button
                key={value}
                type="button"
                className={`chip ${level === value ? 'active' : ''}`}
                onClick={() => changeLevel(value)}
              >
                {LEVEL_LABELS[value]}
              </button>
            ))}
          </div>

          <label className="select-shell">
            <span className="sr-only">Ordenar</span>
            <Icon name="filter" size={15} />
            <select
              value={ordering}
              onChange={(event) => {
                setOrdering(event.target.value)
                setPage(1)
              }}
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
          icon="dumbbell"
          title={hasFilters ? 'Nenhum treino encontrado' : 'Comece pelo seu primeiro treino'}
          description={
            hasFilters
              ? 'Tente mudar a busca ou o filtro de nível.'
              : 'Monte um plano com os exercícios do seu catálogo e defina séries, repetições e cargas.'
          }
          action={
            hasFilters ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  changeSearch('')
                  changeLevel('')
                }}
              >
                <Icon name="refresh" size={16} /> Limpar filtros
              </button>
            ) : (
              <Link to="/treinos/novo" className="btn btn-primary">
                <Icon name="plus" size={17} /> Criar treino
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="results-line">
            <span>
              {data?.count} {data?.count === 1 ? 'treino' : 'treinos'}
            </span>
            <span className="results-line-hint">Toque em um card para ver os detalhes</span>
          </div>

          <div className="workout-grid">
            {results.map((workout) => (
              <Link
                key={workout.id}
                to={`/treinos/${workout.id}`}
                className={`workout-card level-${workout.level}`}
              >
                <div className="workout-card-top">
                  <span className={`level-badge ${workout.level}`}>
                    {levelLabel(workout.level)}
                  </span>
                  <span className="card-arrow">
                    <Icon name="arrowRight" size={16} />
                  </span>
                </div>

                <div className="workout-card-icon">
                  <Icon name="dumbbell" size={26} />
                </div>

                <div className="workout-card-copy">
                  <h2>{workout.name}</h2>
                  <p>{workout.description || 'Sem descrição.'}</p>
                </div>

                <div className="workout-meta">
                  <span>
                    <Icon name="clock" size={15} /> {workout.duration} min
                  </span>
                  <span>
                    <Icon name="activity" size={15} /> {workout.exercise_details.length}{' '}
                    exercícios
                  </span>
                  <span>
                    <Icon name="calendar" size={15} /> {formatShortDate(workout.created_at)}
                  </span>
                </div>

                {workout.exercise_details.length > 0 && (
                  <div className="exercise-chips">
                    {workout.exercise_details.slice(0, 3).map((exercise) => (
                      <span key={exercise.id}>{exercise.name}</span>
                    ))}
                    {workout.exercise_details.length > 3 && (
                      <span>+{workout.exercise_details.length - 3}</span>
                    )}
                  </div>
                )}
              </Link>
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
    </div>
  )
}
