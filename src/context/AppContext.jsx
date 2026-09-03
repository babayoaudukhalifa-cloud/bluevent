import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from '../lib/storage'
import { uid } from '../lib/format'
import { OCCASIONS } from '../lib/constants'
import { allOccasions, slugOccasion } from '../lib/occasions'
import { useAuth } from './AuthContext'
import {
  deleteSend,
  deleteStaff,
  applyStaffRegister,
  insertEvent,
  insertSend,
  insertStaff,
  loadCloud,
  localFallback,
  needsStaffSync,
  replaceStaffDirectory,
  saveSettings,
  updateStaff,
  usingCloud,
} from '../lib/cloud'

const AppContext = createContext(null)

function initialState() {
  return loadState() || localFallback()
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
      .then(async (data) => {
        if (needsStaffSync(data.staff)) {
          data = await replaceStaffDirectory()
        } else {
          data = await applyStaffRegister(data.staff)
        }
        return data
      })
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
        const row = { id: uid('stf'), ...person, years: Number(person.years) || 0 }
        setState((prev) => ({ ...prev, staff: [row, ...prev.staff] }))
        return row
      },
      async editStaff(person) {
        if (usingCloud) {
          const row = await updateStaff(person)
          setState((prev) => ({
            ...prev,
            staff: prev.staff.map((item) => (item.id === row.id ? row : item)),
          }))
          return row
        }
        const row = { ...person, years: Number(person.years) || 0 }
        setState((prev) => ({
          ...prev,
          staff: prev.staff.map((item) => (item.id === row.id ? { ...item, ...row } : item)),
        }))
        return row
      },
      async removeStaff(id) {
        if (usingCloud) await deleteStaff(id)
        setState((prev) => ({
          ...prev,
          staff: prev.staff.filter((person) => person.id !== id),
          events: prev.events.filter((event) => event.staffId !== id),
          sends: prev.sends.map((row) => (row.staffId === id ? { ...row, staffId: null } : row)),
        }))
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
      async removeSend(id) {
        if (usingCloud) await deleteSend(id)
        setState((prev) => ({ ...prev, sends: prev.sends.filter((row) => row.id !== id) }))
      },
      async updateSettings(patch) {
        const next = { ...state.settings, ...patch }
        setState((prev) => ({ ...prev, settings: next }))
        if (usingCloud) await saveSettings(next)
      },
      async addOccasionType({ label, template }) {
        const name = String(label || '').trim()
        if (!name) throw new Error('Enter an occasion name.')
        const value = slugOccasion(name)
        const already = allOccasions(state.settings.customOccasions).some(
          (item) => item.value === value || String(item.label).toLowerCase() === name.toLowerCase(),
        )
        if (already) throw new Error('That occasion is already on the list.')
        const customOccasions = [
          ...(state.settings.customOccasions || []),
          { value, label: name, template: String(template || '').trim() },
        ]
        const next = { ...state.settings, customOccasions }
        setState((prev) => ({ ...prev, settings: next }))
        if (usingCloud) await saveSettings(next, { requireCustomOccasions: true })
        return value
      },
      async removeOccasionType(value) {
        if (OCCASIONS.some((item) => item.value === value)) {
          throw new Error('Built-in occasions cannot be removed.')
        }
        const customOccasions = (state.settings.customOccasions || []).filter((item) => item.value !== value)
        const next = { ...state.settings, customOccasions }
        setState((prev) => ({ ...prev, settings: next }))
        if (usingCloud) await saveSettings(next, { requireCustomOccasions: true })
      },
      async loadStaffRegister() {
        if (usingCloud) {
          const data = await applyStaffRegister(state.staff)
          setState(data)
          return data
        }
        setState(localFallback())
      },
      resetDemo() {
        if (usingCloud) return
        setState(localFallback())
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
