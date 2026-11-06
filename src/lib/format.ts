import { isAxiosError } from 'axios'
import type { Goal, WorkoutLevel } from '../api/types'

export const GOAL_LABELS: Record<Goal, string> = {
  lose_weight: 'Perder peso',
  gain_muscle: 'Ganhar músculo',
  maintain_weight: 'Manter peso',
}

export const LEVEL_LABELS: Record<WorkoutLevel, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

export const LEVEL_ORDER: WorkoutLevel[] = ['beginner', 'intermediate', 'advanced']

export const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Pernas',
  'Glúteos',
  'Abdômen',
  'Cardio',
  'Corpo inteiro',
]

export function goalLabel(goal?: Goal | null) {
  return goal ? GOAL_LABELS[goal] : 'Sem objetivo'
}

export function levelLabel(level?: WorkoutLevel | null) {
  return level ? LEVEL_LABELS[level] : '—'
}

export function formatDate(iso?: string | null) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatShortDate(iso?: string | null) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso))
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function initials(name?: string | null, fallback = 'FT') {
  if (!name) return fallback
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || fallback
}

export function displayName(user?: { first_name?: string; last_name?: string; username: string } | null) {
  if (!user) return 'Atleta'
  const full = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
  return full || user.username
}

export function bmi(weight?: number | null, height?: number | null) {
  if (!weight || !height) return null
  const meters = height / 100
  if (!meters) return null
  return Number((weight / (meters * meters)).toFixed(1))
}

export function bmiLabel(value: number | null) {
  if (value === null) return '—'
  if (value < 18.5) return 'Abaixo do peso'
  if (value < 25) return 'Saudável'
  if (value < 30) return 'Sobrepeso'
  return 'Obesidade'
}

export function todayLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const FIELD_LABELS: Record<string, string> = {
  username: 'Usuário',
  password: 'Senha',
  email: 'E-mail',
  first_name: 'Nome',
  last_name: 'Sobrenome',
  name: 'Nome',
  description: 'Descrição',
  duration: 'Duração',
  calories: 'Calorias',
  sets: 'Séries',
  reps: 'Repetições',
  muscle_group: 'Grupo muscular',
  age: 'Idade',
  height: 'Altura',
  weight: 'Peso',
  goal: 'Objetivo',
  level: 'Nível',
  exercises: 'Exercícios',
  profile: 'Perfil',
}

function flattenError(data: unknown): string[] {
  if (typeof data === 'string') return [data]
  if (Array.isArray(data)) return data.flatMap(flattenError)
  if (data && typeof data === 'object') {
    return Object.entries(data).flatMap(([field, value]) => {
      const messages = flattenError(value)
      if (!messages.length) return []
      if (['detail', 'non_field_errors', 'error'].includes(field)) return messages
      const label = FIELD_LABELS[field] ?? field
      return messages.map((message) => `${label}: ${message}`)
    })
  }
  return []
}

export function apiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Não consegui falar com o servidor. Verifique sua conexão.'
    }
    const message = flattenError(error.response.data).join(' ')
    return message || fallback
  }
  return fallback
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  tone: 'empty' | 'weak' | 'fair' | 'good' | 'strong'
  checks: {
    minLength: boolean
    hasLetters: boolean
    hasNumber: boolean
    hasSpecialOrMixed: boolean
  }
}

export function evaluatePassword(password: string): PasswordStrength {
  const minLength = password.length >= 8
  const hasLetters = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialOrMixed =
    (/[a-z]/.test(password) && /[A-Z]/.test(password)) || /[^a-zA-Z0-9]/.test(password)

  if (!password) {
    return {
      score: 0,
      label: 'Digite uma senha',
      tone: 'empty',
      checks: { minLength, hasLetters, hasNumber, hasSpecialOrMixed },
    }
  }

  const rawScore = [minLength, hasLetters, hasNumber, hasSpecialOrMixed].filter(Boolean).length
  const score = (minLength ? Math.max(1, rawScore) : 1) as 1 | 2 | 3 | 4

  const map: Record<1 | 2 | 3 | 4, { label: string; tone: PasswordStrength['tone'] }> = {
    1: { label: 'Fraca', tone: 'weak' },
    2: { label: 'Razoável', tone: 'fair' },
    3: { label: 'Boa', tone: 'good' },
    4: { label: 'Forte', tone: 'strong' },
  }

  return {
    score,
    label: map[score].label,
    tone: map[score].tone,
    checks: { minLength, hasLetters, hasNumber, hasSpecialOrMixed },
  }
}
