import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getWorkoutPlan } from '../api/endpoints'
import type { WorkoutPlan } from '../api/types'

export default function WorkoutDetailPage() {
  const { id } = useParams()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getWorkoutPlan(Number(id))
      .then((data) => {
        if (!cancelled) setPlan(data)
      })
      .catch(() => {
        if (!cancelled) setError('Não encontrei esse treino.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <p className="muted">Carregando...</p>
  if (error || !plan) return <p className="error">{error || 'Treino não encontrado.'}</p>

  const exercises = plan.exercises ?? []

  return (
    <>
      <Link to="/treinos" className="back-link">
        ← Voltar
      </Link>

      <h2 className="page-title">{plan.name}</h2>
      {plan.description && <p className="muted">{plan.description}</p>}

      <div className="card" style={{ marginTop: '1rem' }}>
        {exercises.length === 0 ? (
          <p className="muted">Sem exercícios neste treino.</p>
        ) : (
          exercises.map((ex) => (
            <div key={ex.id} className="exercise-row">
              <div>
                <strong>{ex.name}</strong>
                {ex.notes && <p className="muted">{ex.notes}</p>}
              </div>
              <div className="muted" style={{ textAlign: 'right' }}>
                {ex.sets}x{ex.reps}
                {ex.weight !== null && <div>{ex.weight} kg</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
