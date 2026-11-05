import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorkoutPlans } from '../api/endpoints'
import type { WorkoutPlan } from '../api/types'

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getWorkoutPlans()
      .then((data) => {
        if (!cancelled) setPlans(data.results)
      })
      .catch(() => {
        if (!cancelled) setError('Erro ao carregar os treinos.')
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
      <h2 className="page-title">Meus treinos</h2>

      {plans.length === 0 ? (
        <p className="muted">Nenhum treino cadastrado ainda.</p>
      ) : (
        <div className="card-list">
          {plans.map((plan) => (
            <Link key={plan.id} to={`/treinos/${plan.id}`} className="card">
              <h3>{plan.name}</h3>
              <p className="muted">{plan.description || 'Sem descrição'}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
