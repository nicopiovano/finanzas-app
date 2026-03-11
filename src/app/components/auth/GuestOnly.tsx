import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../../stores/auth'

export function GuestOnly() {
  const user = useAuthStore((s) => s.user)

  if (user) return <Navigate to="/" replace />
  return <Outlet />
}
