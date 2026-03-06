import { Navigate, Outlet } from 'react-router'
import { useAuthStore, ADMIN_ROLE } from '../../stores/auth'

/**
 * Envuelve rutas que solo deben ser accesibles por administradores.
 * Si el usuario no tiene role === ADMIN_ROLE, redirige al dashboard.
 * Por ahora no hay usuarios admin; el backend puede enviar role en /api/user cuando esté listo.
 */
export function AdminOnly() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === ADMIN_ROLE

  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
