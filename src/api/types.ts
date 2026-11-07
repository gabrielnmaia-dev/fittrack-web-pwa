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
  terms_accepted?: boolean
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

/* -------------------------------------------------------------------------- */
/*                                Privacy / LGPD                              */
/* -------------------------------------------------------------------------- */

export interface TermsOfUse {
  id: number
  version: string
  title: string
  summary: string
  content_terms: string
  content_privacy: string
  effective_date: string
  created_at: string
}

export interface UserTermsAcceptanceStatus {
  current_version: string
  has_accepted_current: boolean
  needs_acceptance: boolean
  latest_acceptance?: {
    terms_version: string
    policy_version: string
    accepted_at: string
  } | null
}

export interface CookieConsentPreferences {
  necessary: boolean
  preferences: boolean
  analytics: boolean
  marketing: boolean
  version?: string
  session_id?: string
}

export interface CookieConsent extends CookieConsentPreferences {
  id?: number
  created_at?: string
  updated_at?: string
  is_default?: boolean
}

export type DataRequestType =
  | 'access'
  | 'export'
  | 'rectification'
  | 'deletion'
  | 'information'
  | 'revocation'

export interface DataSubjectRequest {
  id: number
  request_type: DataRequestType
  request_type_display: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  status_display: string
  details: string
  response_notes: string
  created_at: string
  resolved_at: string | null
}

export interface UserDataExport {
  plataforma: string
  exportado_em: string
  declaracao_lgpd: string
  titular: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    date_joined: string
    is_active: boolean
    perfil_fisico: {
      age: number
      height_cm: number
      weight_kg: number
      goal: Goal
      goal_display: string
    } | null
  }
  treinos: Array<{
    id: number
    name: string
    level: WorkoutLevel
    description: string
    duration: number
    created_at: string
  }>
  planos_alimentares: Array<{
    id: number
    name: string
    description: string
    calories: number
    created_at: string
    meals: Array<{
      id: number
      name: string
      description: string
      calories: number
      created_at: string
    }>
  }>
  historico_aceites_termos: Array<{
    terms_version: string
    policy_version: string
    accepted_at: string
  }>
  solicitacoes_titular: Array<{
    id: number
    type: string
    type_display: string
    status: string
    status_display: string
    details: string
    created_at: string
  }>
}
