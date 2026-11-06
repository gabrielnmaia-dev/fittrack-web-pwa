import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteDietPlan, deleteMeal, getDietPlan } from '../api/endpoints'
import type { DietPlan, Meal } from '../api/types'
import DietPlanFormModal from '../components/forms/DietPlanFormModal'
import MealFormModal from '../components/forms/MealFormModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Icon from '../components/ui/Icon'
import ProgressRing from '../components/ui/ProgressRing'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { useAsync } from '../hooks/useAsync'
import { apiErrorMessage, formatDate, formatNumber } from '../lib/format'

export default function DietDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const planId = Number(id)
  const invalidId = !Number.isInteger(planId) || planId <= 0

  const { data: plan, loading, error, reload, setData } = useAsync(
    () => (invalidId ? Promise.reject(new Error('Dieta inválida.')) : getDietPlan(planId)),
    [planId, invalidId],
  )

  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [mealModalOpen, setMealModalOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [deletingMeal, setDeletingMeal] = useState<Meal | null>(null)
  const [confirmPlanDelete, setConfirmPlanDelete] = useState(false)
  const [deletingPlan, setDeletingPlan] = useState(false)
  const [deletingMealBusy, setDeletingMealBusy] = useState(false)

  function updatePlan(next: DietPlan) {
    setData(next)
  }

  function handleMealSaved(saved: Meal) {
    if (!plan) return
    const exists = plan.meals.some((meal) => meal.id === saved.id)
    updatePlan({
      ...plan,
      meals: exists
        ? plan.meals.map((meal) => (meal.id === saved.id ? saved : meal))
        : [...plan.meals, saved],
    })
  }

  async function handleMealDelete() {
    if (!deletingMeal || !plan) return
    setDeletingMealBusy(true)
    try {
      await deleteMeal(deletingMeal.id)
      updatePlan({
        ...plan,
        meals: plan.meals.filter((meal) => meal.id !== deletingMeal.id),
      })
      toast('Refeição removida.', 'success')
      setDeletingMeal(null)
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível remover a refeição.'), 'error')
    } finally {
      setDeletingMealBusy(false)
    }
  }

  async function handlePlanDelete() {
    if (!plan) return
    setDeletingPlan(true)
    try {
      await deleteDietPlan(plan.id)
      toast('Dieta removida.', 'success')
      navigate('/dietas', { replace: true })
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível remover a dieta.'), 'error')
    } finally {
      setDeletingPlan(false)
      setConfirmPlanDelete(false)
    }
  }

  if (loading) return <PageLoader label="Carregando dieta..." />

  if (error || !plan) {
    return (
      <div className="stack">
        <Link to="/dietas" className="back-link">
          <Icon name="arrowLeft" size={16} /> Voltar para dietas
        </Link>
        <ErrorState
          message={invalidId ? 'O identificador dessa dieta é inválido.' : 'Não encontrei essa dieta.'}
          onRetry={invalidId ? undefined : () => void reload()}
        />
      </div>
    )
  }

  const mealCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0)
  const remaining = plan.calories - mealCalories
  const percent = Math.round((mealCalories / Math.max(plan.calories, 1)) * 100)

  return (
    <div className="stack">
      <Link to="/dietas" className="back-link">
        <Icon name="arrowLeft" size={16} /> Voltar para dietas
      </Link>

      <section className="diet-hero">
        <div className="diet-hero-glow" />
        <div className="diet-hero-main">
          <div className="diet-hero-copy">
            <span className="eyebrow">
              <Icon name="leaf" size={14} /> Plano alimentar
            </span>
            <h1>{plan.name}</h1>
            <p>{plan.description || 'Sem descrição para esta dieta.'}</p>
            <span className="diet-hero-date">
              <Icon name="calendar" size={14} /> Criada em {formatDate(plan.created_at)}
            </span>

            <div className="diet-hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPlanModalOpen(true)}
              >
                <Icon name="edit" size={16} /> Editar dieta
              </button>
              <button
                type="button"
                className="btn btn-danger-ghost"
                onClick={() => setConfirmPlanDelete(true)}
              >
                <Icon name="trash" size={16} /> Excluir
              </button>
            </div>
          </div>

          <div className="diet-hero-ring">
            <ProgressRing
              value={mealCalories}
              max={plan.calories}
              size={190}
              stroke={14}
              label={`${percent}%`}
              caption="da meta diária"
            />
            <div className="diet-ring-legend">
              <div>
                <span>Meta</span>
                <strong>{formatNumber(plan.calories)}</strong>
              </div>
              <div>
                <span>Refeições</span>
                <strong>{formatNumber(mealCalories)}</strong>
              </div>
              <div>
                <span>{remaining >= 0 ? 'Restante' : 'Excedente'}</span>
                <strong className={remaining < 0 ? 'over' : ''}>
                  {formatNumber(Math.abs(remaining))}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="diet-hero-stats">
          <div>
            <span className="detail-stat-icon">
              <Icon name="bowl" size={19} />
            </span>
            <strong>{plan.meals.length}</strong>
            <span>refeições</span>
          </div>
          <div>
            <span className="detail-stat-icon">
              <Icon name="flame" size={19} />
            </span>
            <strong>{formatNumber(mealCalories)}</strong>
            <span>kcal somadas</span>
          </div>
          <div>
            <span className="detail-stat-icon">
              <Icon name="target" size={19} />
            </span>
            <strong>{formatNumber(plan.calories)}</strong>
            <span>kcal de meta</span>
          </div>
          <div>
            <span className="detail-stat-icon">
              <Icon name="chart" size={19} />
            </span>
            <strong>{percent}%</strong>
            <span>da meta</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Refeições do dia</h2>
            <p>
              {plan.meals.length === 0
                ? 'Nenhuma refeição cadastrada'
                : `${plan.meals.length} ${plan.meals.length === 1 ? 'refeição' : 'refeições'} · ${formatNumber(mealCalories)} kcal`}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingMeal(null)
              setMealModalOpen(true)
            }}
          >
            <Icon name="plus" size={15} /> Nova refeição
          </button>
        </header>

        {plan.meals.length === 0 ? (
          <div className="empty-state compact">
            <span className="empty-icon">
              <Icon name="bowl" size={26} />
            </span>
            <h3>Seu dia ainda está vazio</h3>
            <p>Adicione a primeira refeição para começar a acompanhar as calorias.</p>
            <div className="empty-action">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingMeal(null)
                  setMealModalOpen(true)
                }}
              >
                <Icon name="plus" size={15} /> Adicionar refeição
              </button>
            </div>
          </div>
        ) : (
          <ol className="meal-list">
            {plan.meals.map((meal, index) => {
              const share = Math.round((meal.calories / Math.max(mealCalories, 1)) * 100)
              return (
                <li key={meal.id} className="meal-item">
                  <div className="meal-index">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="meal-copy">
                    <div className="meal-title-row">
                      <h3>{meal.name}</h3>
                      <span className="soft-badge orange">{formatNumber(meal.calories)} kcal</span>
                    </div>
                    <p>{meal.description || 'Sem descrição.'}</p>
                    <div className="meal-share">
                      <span style={{ width: `${share}%` }} />
                    </div>
                  </div>
                  <div className="meal-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => {
                        setEditingMeal(meal)
                        setMealModalOpen(true)
                      }}
                      aria-label={`Editar ${meal.name}`}
                      title="Editar"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => setDeletingMeal(meal)}
                      aria-label={`Excluir ${meal.name}`}
                      title="Excluir"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        <div className="meal-total">
          <span>Total das refeições</span>
          <strong>
            {formatNumber(mealCalories)} kcal
            <small>
              {remaining >= 0
                ? ` · ${formatNumber(remaining)} kcal restantes`
                : ` · ${formatNumber(Math.abs(remaining))} kcal acima da meta`}
            </small>
          </strong>
        </div>
      </section>

      <DietPlanFormModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        plan={plan}
        onSaved={updatePlan}
      />

      <MealFormModal
        open={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        dietPlanId={plan.id}
        meal={editingMeal}
        onSaved={handleMealSaved}
      />

      <ConfirmDialog
        open={Boolean(deletingMeal)}
        title="Excluir refeição?"
        description={`"${deletingMeal?.name ?? ''}" será removida deste plano de dieta.`}
        confirmLabel="Excluir refeição"
        loading={deletingMealBusy}
        onConfirm={() => void handleMealDelete()}
        onClose={() => setDeletingMeal(null)}
      />

      <ConfirmDialog
        open={confirmPlanDelete}
        title="Excluir dieta?"
        description={`"${plan.name}" será desativada e sairá da sua lista.`}
        confirmLabel="Excluir dieta"
        loading={deletingPlan}
        onConfirm={() => void handlePlanDelete()}
        onClose={() => setConfirmPlanDelete(false)}
      />
    </div>
  )
}
