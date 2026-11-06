import { api, setTokens } from './client'
import type {
  DietPlan,
  DietPlanInput,
  Exercise,
  ExerciseInput,
  ListParams,
  Meal,
  MealInput,
  Paginated,
  RegisterInput,
  TokenPair,
  UpdateMeInput,
  User,
  WorkoutLevel,
  WorkoutPlan,
  WorkoutPlanInput,
} from './types'

function listQuery(params: ListParams = {}) {
  return {
    page: params.page,
    page_size: params.pageSize,
    search: params.search || undefined,
    ordering: params.ordering || undefined,
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Auth                                     */
/* -------------------------------------------------------------------------- */

export async function login(username: string, password: string) {
  const { data } = await api.post<TokenPair>('/auth/token/', { username, password })
  setTokens(data)
  return data
}

export function logout() {
  setTokens(null)
}

export async function register(payload: RegisterInput) {
  const { data } = await api.post<User>('/auth/register/', payload)
  return data
}

/* -------------------------------------------------------------------------- */
/*                                   Users                                    */
/* -------------------------------------------------------------------------- */

export async function getMe() {
  const { data } = await api.get<User>('/users/me/')
  return data
}

export async function updateMe(payload: UpdateMeInput) {
  const { data } = await api.patch<User>('/users/me/', payload)
  return data
}

export async function getUsers(params: ListParams & { isActive?: boolean } = {}) {
  const { data } = await api.get<Paginated<User>>('/users/', {
    params: {
      ...listQuery(params),
      is_active: params.isActive,
    },
  })
  return data
}

export async function deactivateUser(id: number) {
  await api.delete(`/users/${id}/`)
}

/* -------------------------------------------------------------------------- */
/*                                 Exercises                                  */
/* -------------------------------------------------------------------------- */

export async function getExercises(
  params: ListParams & { muscleGroup?: string } = {},
) {
  const { data } = await api.get<Paginated<Exercise>>('/exercises/', {
    params: {
      ...listQuery(params),
      muscle_group: params.muscleGroup || undefined,
    },
  })
  return data
}

export async function getExercise(id: number) {
  const { data } = await api.get<Exercise>(`/exercises/${id}/`)
  return data
}

export async function createExercise(payload: ExerciseInput) {
  const { data } = await api.post<Exercise>('/exercises/', payload)
  return data
}

export async function updateExercise(id: number, payload: Partial<ExerciseInput>) {
  const { data } = await api.patch<Exercise>(`/exercises/${id}/`, payload)
  return data
}

export async function deleteExercise(id: number) {
  await api.delete(`/exercises/${id}/`)
}

/* -------------------------------------------------------------------------- */
/*                               Workout plans                                */
/* -------------------------------------------------------------------------- */

export async function getWorkoutPlans(
  params: ListParams & { level?: WorkoutLevel } = {},
) {
  const { data } = await api.get<Paginated<WorkoutPlan>>('/workout-plans/', {
    params: {
      ...listQuery(params),
      level: params.level || undefined,
    },
  })
  return data
}

export async function getWorkoutPlan(id: number) {
  const { data } = await api.get<WorkoutPlan>(`/workout-plans/${id}/`)
  return data
}

export async function createWorkoutPlan(payload: WorkoutPlanInput) {
  const { data } = await api.post<WorkoutPlan>('/workout-plans/', payload)
  return data
}

export async function updateWorkoutPlan(id: number, payload: Partial<WorkoutPlanInput>) {
  const { data } = await api.patch<WorkoutPlan>(`/workout-plans/${id}/`, payload)
  return data
}

export async function deleteWorkoutPlan(id: number) {
  await api.delete(`/workout-plans/${id}/`)
}

/* -------------------------------------------------------------------------- */
/*                                 Diet plans                                 */
/* -------------------------------------------------------------------------- */

export async function getDietPlans(params: ListParams = {}) {
  const { data } = await api.get<Paginated<DietPlan>>('/diet-plans/', {
    params: listQuery(params),
  })
  return data
}

export async function getDietPlan(id: number) {
  const { data } = await api.get<DietPlan>(`/diet-plans/${id}/`)
  return data
}

export async function createDietPlan(payload: DietPlanInput) {
  const { data } = await api.post<DietPlan>('/diet-plans/', payload)
  return data
}

export async function updateDietPlan(id: number, payload: Partial<DietPlanInput>) {
  const { data } = await api.patch<DietPlan>(`/diet-plans/${id}/`, payload)
  return data
}

export async function deleteDietPlan(id: number) {
  await api.delete(`/diet-plans/${id}/`)
}

/* -------------------------------------------------------------------------- */
/*                                   Meals                                    */
/* -------------------------------------------------------------------------- */

export async function getMeals(params: ListParams & { dietPlan?: number } = {}) {
  const { data } = await api.get<Paginated<Meal>>('/meals/', {
    params: {
      ...listQuery(params),
      diet_plan: params.dietPlan,
    },
  })
  return data
}

export async function createMeal(payload: MealInput) {
  const { data } = await api.post<Meal>('/meals/', payload)
  return data
}

export async function updateMeal(id: number, payload: Partial<MealInput>) {
  const { data } = await api.patch<Meal>(`/meals/${id}/`, payload)
  return data
}

export async function deleteMeal(id: number) {
  await api.delete(`/meals/${id}/`)
}

/* -------------------------------------------------------------------------- */
/*                                   Health                                   */
/* -------------------------------------------------------------------------- */

export async function getHealth() {
  const { data } = await api.get<{ status: string }>('/health/')
  return data
}
