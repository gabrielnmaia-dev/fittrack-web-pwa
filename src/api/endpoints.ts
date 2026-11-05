import { api, setTokens } from './client'
import type { DietPlan, Paginated, TokenPair, WorkoutPlan } from './types'

export async function login(username: string, password: string) {
  const { data } = await api.post<TokenPair>('/auth/token/', { username, password })
  setTokens(data)
  return data
}

export function logout() {
  setTokens(null)
}

export async function getWorkoutPlans(page = 1, search = '') {
  const { data } = await api.get<Paginated<WorkoutPlan>>('/workout-plans/', {
    params: { page, search: search || undefined },
  })
  return data
}

export async function getWorkoutPlan(id: number) {
  const { data } = await api.get<WorkoutPlan>(`/workout-plans/${id}/`)
  return data
}

export async function getDietPlans(page = 1, search = '') {
  const { data } = await api.get<Paginated<DietPlan>>('/diet-plans/', {
    params: { page, search: search || undefined },
  })
  return data
}

export async function getDietPlan(id: number) {
  const { data } = await api.get<DietPlan>(`/diet-plans/${id}/`)
  return data
}