import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { hasRefreshToken } from '../api/client'
import { login as apiLogin, logout as apiLogout } from '../api/endpoints'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Se há refresh token salvo, tratamos como logado; o primeiro 401 renova o access
  const [isAuthenticated, setIsAuthenticated] = useState(hasRefreshToken())

  useEffect(() => {
    const onLogout = () => setIsAuthenticated(false)
    window.addEventListener('fittrack:logout', onLogout)
    return () => window.removeEventListener('fittrack:logout', onLogout)
  }, [])

  async function login(username: string, password: string) {
    await apiLogin(username, password)
    setIsAuthenticated(true)
  }

  function logout() {
    apiLogout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}