import { Link } from 'react-router-dom'
import { getDietPlans, getExercises, getWorkoutPlans } from '../api/endpoints'
import { useAuth } from '../auth/AuthContext'
import Icon from '../components/ui/Icon'
import ProgressRing from '../components/ui/ProgressRing'
import { EmptyState, ErrorState, SkeletonCards } from '../components/ui/States'
import { useAsync } from '../hooks/useAsync'
import {
  bmi,
  bmiLabel,
  displayName,
  formatNumber,
  goalLabel,
  greeting,
  levelLabel,
  todayLabel,
} from '../lib/format'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useAsync(
    async () => {
      const [workouts, diets, exercises] = await Promise.all([
        getWorkoutPlans({ pageSize: 3, ordering: '-created_at' }),
        getDietPlans({ pageSize: 3, ordering: '-created_at' }),
        getExercises({ pageSize: 1 }),
      ])
      return { workouts, diets, exercises }
    },
    [],
  )

  const profile = user?.profile
  const imc = bmi(profile?.weight, profile?.height)
  const latestDiet = data?.diets.results[0] ?? null
  const totalMeals = latestDiet?.meals.length ?? 0
  const mealCalories = latestDiet?.meals.reduce((sum, meal) => sum + meal.calories, 0) ?? 0

  if (loading) {
    return (
      <div className="stack-lg">
        <div className="dashboard-hero skeleton-hero">
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line skeleton-line-xl" />
          <div className="skeleton-line skeleton-line-md" />
        </div>
        <SkeletonCards count={3} />
        <SkeletonCards count={2} />
      </div>
    )
  }

  if (error || !data) {
    return <ErrorState message="Verifique sua conexão e tente novamente." onRetry={() => void reload()} />
  }

  const isEmpty =
    data.workouts.count === 0 && data.diets.count === 0 && data.exercises.count === 0

  return (
    <div className="stack-lg dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero-glow" />
        <div className="dashboard-hero-copy">
          <span className="eyebrow">
            <span className="live-dot" /> {greeting()}, {displayName(user).split(' ')[0]}
          </span>
          <h1>
            Hoje é dia de
            <br />
            <em>avançar um pouco.</em>
          </h1>
          <p className="dashboard-date">
            <Icon name="calendar" size={15} />
            <span className="capitalize">{todayLabel()}</span>
          </p>

          <div className="dashboard-quick-actions">
            <Link to="/treinos/novo" className="btn btn-primary">
              <Icon name="plus" size={17} /> Novo treino
            </Link>
            <Link to="/dietas?novo=1" className="btn btn-soft">
              <Icon name="bowl" size={17} /> Nova dieta
            </Link>
            <Link to="/exercicios?novo=1" className="btn btn-ghost">
              <Icon name="activity" size={17} /> Exercício
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-panel">
          <div className="profile-mini-head">
            <span className="avatar avatar-lg">
              {displayName(user)
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </span>
            <div>
              <strong>{displayName(user)}</strong>
              <span>{goalLabel(profile?.goal)}</span>
            </div>
          </div>

          <div className="profile-mini-stats">
            <div>
              <span>Peso</span>
              <strong>{profile ? `${profile.weight} kg` : '—'}</strong>
            </div>
            <div>
              <span>Altura</span>
              <strong>{profile ? `${profile.height} cm` : '—'}</strong>
            </div>
            <div>
              <span>IMC</span>
              <strong>{imc ?? '—'}</strong>
              <small>{bmiLabel(imc)}</small>
            </div>
          </div>

          <Link to="/perfil" className="hero-panel-link">
            Editar perfil <Icon name="arrowRight" size={15} />
          </Link>
        </div>
      </section>

      <section className="stat-grid" aria-label="Resumo">
        <Link to="/treinos" className="stat-card stat-green">
          <span className="stat-icon">
            <Icon name="dumbbell" size={20} />
          </span>
          <div>
            <strong>{formatNumber(data.workouts.count)}</strong>
            <span>planos de treino</span>
          </div>
          <span className="stat-trend">
            <Icon name="arrowRight" size={15} />
          </span>
        </Link>

        <Link to="/dietas" className="stat-card stat-orange">
          <span className="stat-icon">
            <Icon name="leaf" size={20} />
          </span>
          <div>
            <strong>{formatNumber(data.diets.count)}</strong>
            <span>planos de dieta</span>
          </div>
          <span className="stat-trend">
            <Icon name="arrowRight" size={15} />
          </span>
        </Link>

        <Link to="/exercicios" className="stat-card stat-blue">
          <span className="stat-icon">
            <Icon name="activity" size={20} />
          </span>
          <div>
            <strong>{formatNumber(data.exercises.count)}</strong>
            <span>exercícios no catálogo</span>
          </div>
          <span className="stat-trend">
            <Icon name="arrowRight" size={15} />
          </span>
        </Link>

        <div className="stat-card stat-violet">
          <span className="stat-icon">
            <Icon name="flame" size={20} />
          </span>
          <div>
            <strong>{latestDiet ? formatNumber(latestDiet.calories) : '—'}</strong>
            <span>kcal na dieta atual</span>
          </div>
        </div>
      </section>

      {isEmpty ? (
        <section className="onboarding-card">
          <div className="onboarding-copy">
            <span className="empty-icon">
              <Icon name="sparkles" size={26} />
            </span>
            <div>
              <h2>Seu FitTrack está pronto para começar</h2>
              <p>Monte seu primeiro treino e sua primeira dieta para ver o painel ganhar vida.</p>
            </div>
          </div>
          <div className="onboarding-steps">
            <Link to="/exercicios?novo=1" className="onboarding-step">
              <span>01</span>
              <div>
                <strong>Cadastre exercícios</strong>
                <p>Monte seu catálogo pessoal ou use o global.</p>
              </div>
              <Icon name="chevronRight" size={17} />
            </Link>
            <Link to="/treinos/novo" className="onboarding-step">
              <span>02</span>
              <div>
                <strong>Crie um treino</strong>
                <p>Escolha os exercícios, séries e repetições.</p>
              </div>
              <Icon name="chevronRight" size={17} />
            </Link>
            <Link to="/dietas?novo=1" className="onboarding-step">
              <span>03</span>
              <div>
                <strong>Organize sua dieta</strong>
                <p>Adicione refeições e acompanhe as calorias.</p>
              </div>
              <Icon name="chevronRight" size={17} />
            </Link>
          </div>
        </section>
      ) : (
        <div className="dashboard-columns">
          <section className="panel">
            <header className="panel-header">
              <div>
                <h2>Treinos recentes</h2>
                <p>Seus últimos planos criados</p>
              </div>
              <Link to="/treinos" className="panel-link">
                Ver todos <Icon name="arrowRight" size={15} />
              </Link>
            </header>

            {data.workouts.results.length === 0 ? (
              <EmptyState
                icon="dumbbell"
                title="Nenhum treino ainda"
                description="Crie seu primeiro plano de treino em poucos passos."
                action={
                  <Link to="/treinos/novo" className="btn btn-primary btn-sm">
                    <Icon name="plus" size={16} /> Criar treino
                  </Link>
                }
              />
            ) : (
              <div className="mini-list">
                {data.workouts.results.map((workout) => (
                  <Link key={workout.id} to={`/treinos/${workout.id}`} className="mini-row">
                    <span className="mini-row-icon mini-row-icon-green">
                      <Icon name="dumbbell" size={18} />
                    </span>
                    <div className="mini-row-copy">
                      <strong>{workout.name}</strong>
                      <span>
                        {workout.duration} min · {workout.exercise_details.length} exercícios ·{' '}
                        {levelLabel(workout.level)}
                      </span>
                    </div>
                    <Icon name="chevronRight" size={17} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <header className="panel-header">
              <div>
                <h2>Dieta em foco</h2>
                <p>{latestDiet ? latestDiet.name : 'Sua alimentação de hoje'}</p>
              </div>
              <Link to="/dietas" className="panel-link">
                Ver dietas <Icon name="arrowRight" size={15} />
              </Link>
            </header>

            {latestDiet ? (
              <div className="diet-focus">
                <ProgressRing
                  value={mealCalories}
                  max={latestDiet.calories}
                  size={124}
                  label={formatNumber(mealCalories)}
                  caption="kcal nas refeições"
                />
                <div className="diet-focus-info">
                  <div className="diet-focus-total">
                    <span>Meta diária</span>
                    <strong>{formatNumber(latestDiet.calories)} kcal</strong>
                  </div>
                  <div className="diet-focus-total">
                    <span>Refeições</span>
                    <strong>{totalMeals}</strong>
                  </div>
                  {latestDiet.meals.slice(0, 3).map((meal) => (
                    <div key={meal.id} className="diet-focus-meal">
                      <span>{meal.name}</span>
                      <strong>{formatNumber(meal.calories)} kcal</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon="leaf"
                title="Nenhuma dieta ainda"
                description="Crie um plano e adicione refeições para acompanhar suas calorias."
                action={
                  <Link to="/dietas?novo=1" className="btn btn-primary btn-sm">
                    <Icon name="plus" size={16} /> Criar dieta
                  </Link>
                }
              />
            )}
          </section>
        </div>
      )}
    </div>
  )
}
