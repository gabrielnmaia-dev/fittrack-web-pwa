import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteDietPlan, getDietPlans } from '../api/endpoints'
import type { DietPlan } from '../api/types'
import DietPlanFormModal from '../components/forms/DietPlanFormModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import ProgressRing from '../components/ui/ProgressRing'
import SearchInput from '../components/ui/SearchInput'
import { EmptyState, ErrorState, SkeletonCards } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { useAsync, useDebouncedValue } from '../hooks/useAsync'
import { apiErrorMessage, formatDate, formatNumber } from '../lib/format'

const PAGE_SIZE = 9

const sorts = [
  { value: '-created_at', label: 'Mais recentes' },
  { value: 'name', label: 'Nome (A–Z)' },
  { value: '-calories', label: 'Mais calorias' },
]

export default function DietsPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DietPlan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<DietPlan | null>(null)
  const [deleting, setDeleting] = useState(false)

  const debouncedSearch = useDebouncedValue(search)

  // Quando chegar por um link "/dietas?novo=1", abrimos o modal de criação
  // direto na renderização (sem efeito), e limpamos o parâmetro ao fechar.
  const novo = searchParams.get('novo') === '1'

  const { data, loading, error, reload, setData } = useAsync(
    () =>
      getDietPlans({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        ordering,
      }),
    [page, debouncedSearch, ordering],
  )

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(plan: DietPlan) {
    setEditing(plan)
    setModalOpen(true)
  }

  function handleSaved(saved: DietPlan) {
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
    if (!deletingPlan) return
    setDeleting(true)
    try {
      await deleteDietPlan(deletingPlan.id)
      toast('Dieta removida.', 'success')
      setDeletingPlan(null)
      void reload(true)
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível remover a dieta.'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const results = data?.results ?? []
  const hasSearch = Boolean(debouncedSearch)

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Nutrição sem complicação"
        title="Minhas dietas"
        description="Defina metas de calorias e organize suas refeições ao longo do dia."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <Icon name="plus" size={17} /> Nova dieta
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
          placeholder="Buscar dieta..."
        />

        <div className="toolbar-controls">
          <label className="select-shell">
            <Icon name="filter" size={15} />
            <select
              value={ordering}
              onChange={(event) => {
                setOrdering(event.target.value)
                setPage(1)
              }}
              aria-label="Ordenar dietas"
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
          icon="leaf"
          title={hasSearch ? 'Nenhuma dieta encontrada' : 'Organize sua alimentação'}
          description={
            hasSearch
              ? 'Tente buscar por outro nome ou limpe a busca.'
              : 'Crie uma dieta, defina sua meta diária e adicione as refeições para acompanhar as calorias.'
          }
          action={
            hasSearch ? (
              <button type="button" className="btn btn-ghost" onClick={() => setSearch('')}>
                <Icon name="refresh" size={16} /> Limpar busca
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Icon name="plus" size={17} /> Criar dieta
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="results-line">
            <span>
              {formatNumber(data?.count ?? 0)} {(data?.count ?? 0) === 1 ? 'dieta' : 'dietas'}
            </span>
            <span className="results-line-hint">Meta diária e refeições em um só lugar</span>
          </div>

          <div className="diet-grid">
            {results.map((plan) => {
              const mealCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0)
              return (
                <article key={plan.id} className="diet-card">
                  <div className="diet-card-head">
                    <ProgressRing
                      value={mealCalories}
                      max={plan.calories}
                      size={92}
                      stroke={8}
                      label={`${Math.round((mealCalories / Math.max(plan.calories, 1)) * 100)}%`}
                    />
                    <div className="diet-card-head-copy">
                      <span className="soft-badge orange">
                        <Icon name="flame" size={13} /> {formatNumber(plan.calories)} kcal
                      </span>
                      <span className="diet-card-meals">
                        {plan.meals.length} {plan.meals.length === 1 ? 'refeição' : 'refeições'}
                      </span>
                      <span className="diet-card-date">
                        Criada em {formatDate(plan.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="diet-card-copy">
                    <h3>
                      <Link to={`/dietas/${plan.id}`}>{plan.name}</Link>
                    </h3>
                    <p>{plan.description || 'Sem descrição.'}</p>
                  </div>

                  <div className="diet-card-progress">
                    <div className="diet-progress-track">
                      <span
                        style={{
                          width: `${Math.min(100, (mealCalories / Math.max(plan.calories, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span>
                      {formatNumber(mealCalories)} de {formatNumber(plan.calories)} kcal nas
                      refeições
                    </span>
                  </div>

                  <div className="diet-card-footer">
                    <Link to={`/dietas/${plan.id}`} className="btn btn-soft btn-sm">
                      Abrir plano <Icon name="arrowRight" size={15} />
                    </Link>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => openEdit(plan)}
                        aria-label={`Editar ${plan.name}`}
                        title="Editar"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => setDeletingPlan(plan)}
                        aria-label={`Excluir ${plan.name}`}
                        title="Excluir"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <Pagination
            page={page}
            count={data?.count ?? 0}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}

      <DietPlanFormModal
        open={modalOpen || novo}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
          void setSearchParams({}, { replace: true })
        }}
        plan={novo ? undefined : editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deletingPlan)}
        title="Excluir dieta?"
        description={`"${deletingPlan?.name ?? ''}" será desativada e sairá da sua lista. As refeições continuam salvas no histórico.`}
        confirmLabel="Excluir dieta"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingPlan(null)}
      />
    </div>
  )
}
