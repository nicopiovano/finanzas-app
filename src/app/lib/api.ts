import axios from 'axios'

const ENV_API_URL = import.meta.env?.VITE_API_URL as string | undefined

if (!ENV_API_URL) {
  throw new Error('VITE_API_URL no está definida en el entorno de Vite')
}

export const API_BASE_URL = ENV_API_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

export async function csrf() {
  await api.get('/sanctum/csrf-cookie')
}

function readCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length < 2) return null
  return parts.pop()!.split(';').shift() || null
}

api.interceptors.request.use((config) => {
  const token = readCookie('XSRF-TOKEN')
  if (token) {
    config.headers = config.headers || {}
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  }
  return config
})
