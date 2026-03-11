/**
 * Toggle auth: comment one line and uncomment the other to enable/disable login.
 * When false, app runs with a guest user and no login/register required.
 */
export const AUTH_ENABLED = true;
// export const AUTH_ENABLED = false;

/**
 * Demo mode: no login required. Activado por:
 * - VITE_DEMO_MODE=true (build/deploy demo), o
 * - ?demo en la URL (ej. /?demo o /ingresos?demo).
 */
export function getIsDemoMode(): boolean {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return true;
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('demo');
}

/**
 * En esta máquina el usuario se considera siempre administrador (menú y ruta Configuración).
 * Poner a false en otros entornos.
 */
export const FORCE_ADMIN = false;
