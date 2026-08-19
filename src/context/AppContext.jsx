import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from '../lib/storage'
import { seedEvents, seedSends, seedSettings, seedStaff } from '../lib/seed'
import { uid } from '../lib/format'
import { useAuth } from './AuthContext'
import {
  insertEvent,
  insertSend,
  insertStaff,
  loadCloud,
  localFallback,
  saveSettings,
  usingCloud,
} from '../lib/cloud'

const AppContext = createContext(null)

function initialState() {
  return loadState() || {
    staff: seedStaff(),
    events: seedEvents(),
    sends: seedSends(),
    settings: seedSettings(),
  }
}

export function AppProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState(usingCloud ? localFallback() : initialState)
  const [loading, setLoading] = useState(usingCloud)
  const [cloudError, setCloudError] = useState('')

  useEffect(() => {
    if (!usingCloud) return undefined
    if (authLoading) return undefined
    if (!user) {
      setLoading(false)
      return undefined
    }
    let mounted = true
    setLoading(true)
    loadCloud()
      .then((data) => {
        if (mounted) {
          setState(data)
          setCloudError('')
        }
      })
      .catch((err) => {
        if (mounted) setCloudError(err.message || 'Could not reach Supabase')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [user, authLoading])

  useEffect(() => {
    if (!usingCloud) saveState(state)
  }, [state])

  const api = useMemo(() => {
    const staffById = Object.fromEntries(state.staff.map((s) => [s.id, s]))

    return {
      ...state,
      staffById,
      usingCloud,
      loading,
      cloudError,
      async addStaff(person) {
        if (usingCloud) {
          const row = await insertStaff(person)
          setState((prev) => ({ ...prev, staff: [row, ...prev.staff] }))
          return row
        }
        const row = { id: uid('stf'), years: Number(person.years) || 0, ...person }
        setState((prev) => ({ ...prev, staff: [row, ...prev.staff] }))
        return row
      },
      async addEvent(event) {
        if (usingCloud) {
          const row = await insertEvent({ auto: true, ...event })
          setState((prev) => ({ ...prev, events: [row, ...prev.events] }))
          return row
        }
        const row = { id: uid('evt'), auto: true, ...event }
        setState((prev) => ({ ...prev, events: [row, ...prev.events] }))
        return row
      },
      async addSend(send) {
        if (usingCloud) {
          const row = await insertSend(send)
          setState((prev) => ({ ...prev, sends: [row, ...prev.sends] }))
          return row
        }
        const row = {
          id: uid('snd'),
          status: 'delivered',
          sentAt: new Date().toISOString(),
          ...send,
        }
        setState((prev) => ({ ...prev, sends: [row, ...prev.sends] }))
        return row
      },
      async updateSettings(patch) {
        const next = { ...state.settings, ...patch }
        setState((prev) => ({ ...prev, settings: next }))
        if (usingCloud) await saveSettings(next)
      },
      resetDemo() {
        if (usingCloud) return
        setState({
          staff: seedStaff(),
          events: seedEvents(),
          sends: seedSends(),
          settings: seedSettings(),
        })
      },
    }
  }, [state, loading, cloudError])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
