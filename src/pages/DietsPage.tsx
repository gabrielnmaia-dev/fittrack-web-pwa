import { useEffect, useState } from 'react'
import { getDietPlans } from '../api/endpoints'
import type { DietPlan } from '../api/types'

export default function DietsPage() {
  const [plans, setPlans] = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getDietPlans()
      .then((data) => {
        if (!cancelled) setPlans(data.results)
      })
      .catch(() => {
        if (!cancelled) setError('Erro ao carregar as dietas.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p className="muted">Carregando...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <>
      <h2 className="page-title">Minhas dietas</h2>

      {plans.length === 0 ? (
        <p className="muted">Nenhuma dieta cadastrada ainda.</p>
      ) : (
        <div className="card-list">
          {plans.map((plan) => (
            <div key={plan.id} className="card">
              <h3>{plan.name}</h3>
              <p className="muted">{plan.description || 'Sem descrição'}</p>

              {(plan.meals ?? []).map((meal) => (
                <div key={meal.id} className="exercise-row">
                  <div>
                    <strong>{meal.name}</strong>
                    <p className="muted">{meal.time}</p>
                  </div>
                  <div className="muted">{meal.calories} kcal</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
