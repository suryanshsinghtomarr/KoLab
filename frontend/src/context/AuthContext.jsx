import { useEffect, useState } from 'react'
import * as authApi from '../api/authApi'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    authApi.getMe().then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
  }, [])

  const signIn = ({ user: nextUser, token }) => {
    localStorage.setItem('token', token)
    setUser(nextUser)
  }
  const signOut = () => { localStorage.removeItem('token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}
