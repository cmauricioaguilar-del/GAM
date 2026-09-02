import { useState, useCallback } from 'react'

const SESSION_KEY = 'gam_auth'
const APP_USER = import.meta.env.VITE_APP_USER ?? 'gam'
const APP_PASS = import.meta.env.VITE_APP_PASS ?? 'Gam2026#'

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )

  const login = useCallback((user: string, pass: string): boolean => {
    if (user.trim() === APP_USER && pass === APP_PASS) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthenticated(false)
  }, [])

  return { authenticated, login, logout }
}
