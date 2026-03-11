import { create } from 'zustand'
import { api, csrf } from '../lib/api'
import { AUTH_ENABLED, FORCE_ADMIN, getIsDemoMode } from '../config'
import { AxiosError } from 'axios'

/** Role que debe devolver el backend para usuarios administradores. Por ahora no hay admins. */
export const ADMIN_ROLE = 'admin' as const

export interface User {
  id: number
  name: string
  email: string
  /** Rol del usuario. Cuando el backend lo soporte, usar para restringir Configuración a admins. */
  role?: string
}

const GUEST_USER: User = { id: 0, name: 'Invitado', email: 'invitado@local' }

function withAdminIfForced(user: User): User {
  return FORCE_ADMIN ? { ...user, role: ADMIN_ROLE } : user
}

interface AuthState {
  user: User | null
  loading: boolean
  bootstrapping: boolean
  error: string | null
  clearError: () => void
  setError: (message: string) => void
  emailExists: (email: string) => Promise<boolean>
  me: () => Promise<User>
  bootstrap: () => Promise<void>
  login: (credentials: { email: string; password: string }) => Promise<User>
  register: (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => Promise<User>
  logout: () => Promise<void>
}

function errorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<{
    message?: string
    errors?: Record<string, string[]>
  }>
  const status = axiosErr?.response?.status
  const data = axiosErr?.response?.data

  if (status === 422 && data?.errors) {
    const firstKey = Object.keys(data.errors)[0]
    const firstMsg = data.errors?.[firstKey]?.[0]
    if (firstMsg) return String(firstMsg)
  }

  if (data?.message) return String(data.message)
  if (axiosErr?.message) return String(axiosErr.message)
  return 'Ocurrió un error.'
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  bootstrapping: true,
  error: null,

  clearError: () => set({ error: null }),
  setError: (message) => set({ error: message }),

  emailExists: async (email) => {
    const normalized = String(email || '').trim().toLowerCase()
    const res = await api.get('/api/email-exists', { params: { email: normalized } })
    return res?.data?.exists === true
  },

  me: async () => {
    const res = await api.get('/api/user')
    return res.data
  },

  bootstrap: async () => {
    set({ bootstrapping: true })
    if (!AUTH_ENABLED || getIsDemoMode()) {
      set({ user: withAdminIfForced(GUEST_USER), bootstrapping: false })
      return
    }
    try {
      const user = await api.get('/api/user').then((r) => r.data)
      set({ user: withAdminIfForced(user), error: null })
    } catch {
      set({ user: null })
    } finally {
      set({ bootstrapping: false })
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null })
    try {
      await csrf()
      await api.post('/api/login', { email, password })
      const user = await api.get('/api/user').then((r) => r.data)
      set({ user: withAdminIfForced(user) })
      return withAdminIfForced(user)
    } catch (err) {
      set({ error: errorMessage(err) })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  register: async ({ name, email, password, password_confirmation }) => {
    set({ loading: true, error: null })
    try {
      await csrf()
      await api.post('/api/register', { name, email, password, password_confirmation })
      const user = await api.get('/api/user').then((r) => r.data)
      set({ user: withAdminIfForced(user) })
      return withAdminIfForced(user)
    } catch (err) {
      set({ error: errorMessage(err) })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    if (!AUTH_ENABLED || getIsDemoMode()) {
      set({ user: GUEST_USER, loading: false })
      return
    }
    set({ loading: true, error: null })
    try {
      await csrf()
      await api.post('/api/logout')
    } finally {
      set({ user: null, loading: false })
    }
  },
}))
