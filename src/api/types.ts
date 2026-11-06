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

export type Goal = 'lose_weight' | 'gain_muscle' | 'maintain_weight'

export interface UserProfile {
  id: number
  age: number
  height: number
  weight: number
  goal: Goal
}

export interface ProfileInput {
  age: number
  height: number
  weight: number
  goal: Goal
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  profile: UserProfile | null
}

export interface RegisterInput {
  username: string
  email?: string
  password: string
  first_name?: string
  last_name?: string
  profile?: ProfileInput
}

export interface UpdateMeInput {
  username?: string
  email?: string
  first_name?: string
  last_name?: string
  password?: string
  profile?: Partial<ProfileInput>
}

export interface Exercise {
  id: number
  name: string
  description: string
  sets: number
  reps: number
  muscle_group: string
  user: number | null
  is_global: boolean
  created_at: string
  updated_at: string
}

export interface ExerciseInput {
  name: string
  description: string
  sets: number
  reps: number
  muscle_group: string
}

export type WorkoutLevel = 'beginner' | 'intermediate' | 'advanced'

export interface WorkoutPlan {
  id: number
  name: string
  description: string
  duration: number
  level: WorkoutLevel
  user: number
  exercises: number[]
  exercise_details: Exercise[]
  created_at: string
  updated_at: string
}

export interface WorkoutPlanInput {
  name: string
  description: string
  duration: number
  level: WorkoutLevel
  exercises: number[]
}

export interface Meal {
  id: number
  name: string
  description: string
  calories: number
  diet_plan: number
  created_at: string
  updated_at: string
}

export interface MealInput {
  name: string
  description: string
  calories: number
  diet_plan: number
}

export interface DietPlan {
  id: number
  name: string
  description: string
  calories: number
  user: number
  meals: Meal[]
  created_at: string
  updated_at: string
}

export interface DietPlanInput {
  name: string
  description: string
  calories: number
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  ordering?: string
}
