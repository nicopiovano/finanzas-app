import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useAuthStore } from '../../stores/auth'

export function AuthBootstrap() {
  const bootstrap = useAuthStore((s) => s.bootstrap)
  const bootstrapping = useAuthStore((s) => s.bootstrapping)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  if (bootstrapping) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
        <div className="text-sm text-slate-300">Cargando sesión…</div>
      </div>
    )
  }

  return <Outlet />
}
