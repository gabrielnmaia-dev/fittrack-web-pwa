import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isAxiosError } from 'axios'
import { hasRefreshToken } from '../api/client'
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/endpoints'
import type { RegisterInput, User } from '../api/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  initializing: boolean
  login: (username: string, password: string) => Promise<User>
  register: (payload: RegisterInput) => Promise<User>
  logout: () => void
  refreshUser: () => Promise<User | null>
  setUser: (user: User) => void
}

const USER_KEY = 'fittrack:user'

const AuthContext = createContext<AuthContextValue | null>(null)

function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function cacheUser(user: User | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() =>
    hasRefreshToken() ? readCachedUser() : null,
  )
  const [initializing, setInitializing] = useState(() => hasRefreshToken() && !readCachedUser())

  const setUser = useCallback((next: User) => {
    setUserState(next)
    cacheUser(next)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!hasRefreshToken()) return null
    try {
      const me = await getMe()
      setUser(me)
      return me
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        apiLogout()
        setUserState(null)
        cacheUser(null)
      }
      return null
    }
  }, [setUser])

  useEffect(() => {
    const onLogout = () => {
      setUserState(null)
      cacheUser(null)
    }
    window.addEventListener('fittrack:logout', onLogout)
    return () => window.removeEventListener('fittrack:logout', onLogout)
  }, [])

  // Restaura o usuário a partir do token de refresh ao montar. A atualização
  // do estado só ocorre após a requisição assíncrona terminar, então é
  // intencional disparar setState a partir desse efeito.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hasRefreshToken()) return

    let cancelled = false
    refreshUser().finally(() => {
      if (!cancelled) setInitializing(false)
    })
    return () => {
      cancelled = true
    }
  }, [refreshUser])
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(
    async (username: string, password: string) => {
      await apiLogin(username, password)
      const me = await getMe()
      setUser(me)
      return me
    },
    [setUser],
  )

  const register = useCallback(
    async (payload: RegisterInput) => {
      await apiRegister(payload)
      return login(payload.username, payload.password)
    },
    [login],
  )

  const logout = useCallback(() => {
    apiLogout()
    setUserState(null)
    cacheUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, initializing, login, register, logout, refreshUser, setUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
