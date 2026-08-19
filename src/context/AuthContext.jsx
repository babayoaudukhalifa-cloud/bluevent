import { createContext, useContext, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const SESSION_KEY = 'blumen_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persist = (sessionUser) => {
    if (sessionUser) localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    else localStorage.removeItem(SESSION_KEY)
    setUser(sessionUser)
    return sessionUser
  }

  const loadProfile = async (authUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()
    return persist({
      id: authUser.id,
      email: authUser.email,
      full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email,
      role: profile?.role || 'manager',
    })
  }

  useEffect(() => {
    let mounted = true
    const boot = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession()
        if (data?.session?.user && mounted) {
          await loadProfile(data.session.user)
          if (mounted) setLoading(false)
          return
        }
      }
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw && mounted) {
        try { setUser(JSON.parse(raw)) } catch { localStorage.removeItem(SESSION_KEY) }
      }
      if (mounted) setLoading(false)
    }
    boot()

    if (!isSupabaseConfigured || !supabase) return undefined
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await loadProfile(session.user)
      else persist(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return persist({
        id: 'local-manager',
        email,
        full_name: email.split('@')[0],
        role: 'manager',
      })
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw error
    return loadProfile(data.user)
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    persist(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, usingCloud: isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
