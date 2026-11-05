export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface TokenPair {
  access: string
  refresh: string
}

export interface User {
  id: number
  username: string
  email: string
}

export interface Exercise {
  id: number
  name: string
  sets: number
  reps: number
  weight: number | null
  notes: string
}

export interface WorkoutPlan {
  id: number
  name: string
  description: string
  exercises: Exercise[]
  created_at: string
  updated_at: string
}

export interface Meal {
  id: number
  name: string
  time: string
  calories: number
  description: string
}

export interface DietPlan {
  id: number
  name: string
  description: string
  meals: Meal[]
  created_at: string
  updated_at: string
}