import { Navigate, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/auth'
import { Layout } from '../Layout'

export function ProtectedLayout() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Layout />
}
