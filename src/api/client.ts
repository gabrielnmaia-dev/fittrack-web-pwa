import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { TokenPair } from './types'

const REFRESH_KEY = 'fittrack:refresh'

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
).replace(/\/+$/, '')

let accessToken: string | null = null
let refreshPromise: Promise<string> | null = null

export function setTokens(tokens: TokenPair | null) {
  if (tokens) {
    accessToken = tokens.access
    localStorage.setItem(REFRESH_KEY, tokens.refresh)
  } else {
    accessToken = null
    localStorage.removeItem(REFRESH_KEY)
  }
}

export function hasRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) !== null
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

async function refreshAccessToken(): Promise<string> {
  const refresh = localStorage.getItem(REFRESH_KEY)
  if (!refresh) throw new Error('Sem refresh token')

  // axios "puro" pra não cair no interceptor de novo
  const { data } = await axios.post<{ access: string; refresh?: string }>(
    `${API_BASE_URL}/auth/token/refresh/`,
    { refresh },
  )

  accessToken = data.access
  if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
  return data.access
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const newAccess = await refreshPromise
      original.headers.Authorization = `Bearer ${newAccess}`
      return api(original)
    } catch (refreshError) {
      setTokens(null)
      window.dispatchEvent(new Event('fittrack:logout'))
      return Promise.reject(refreshError)
    }
  },
)