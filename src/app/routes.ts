import { createBrowserRouter } from 'react-router';
import { AuthBootstrap } from './components/auth/AuthBootstrap';
import { GuestOnly } from './components/auth/GuestOnly';
import { ProtectedLayout } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { CedearsAccionesPage } from './pages/cedears-acciones/CedearsAccionesPage';
import { ComprasCedearsAcciones } from './pages/cedears-acciones/ComprasCedearsAcciones';
import { VentasCedearsAcciones } from './pages/cedears-acciones/VentasCedearsAcciones';
import { RendimientoCedearsAcciones } from './pages/cedears-acciones/RendimientoCedearsAcciones';
import { DolarPage } from './pages/dolar/DolarPage';
import { PreciosDolar } from './pages/dolar/PreciosDolar';
import { ComprasDolar } from './pages/dolar/ComprasDolar';
import { HistorialDolar } from './pages/dolar/HistorialDolar';
import { IngresosPage } from './pages/ingresos/IngresosPage';

export const router = createBrowserRouter([
  {
    Component: AuthBootstrap,
    children: [
      // Rutas públicas (solo para invitados)
      {
        Component: GuestOnly,
        children: [
          { path: '/login', Component: LoginPage },
          { path: '/register', Component: RegisterPage },
        ],
      },
      // Rutas protegidas (requieren autenticación)
      {
        path: '/',
        Component: ProtectedLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: 'cedears-acciones',
            Component: CedearsAccionesPage,
            children: [
              { index: true, Component: ComprasCedearsAcciones },
              { path: 'compras', Component: ComprasCedearsAcciones },
              { path: 'ventas', Component: VentasCedearsAcciones },
              { path: 'rendimiento', Component: RendimientoCedearsAcciones },
            ],
          },
          {
            path: 'dolar',
            Component: DolarPage,
            children: [
              { path: 'precios', Component: PreciosDolar },
              { path: 'compras', Component: ComprasDolar },
              { path: 'historial', Component: HistorialDolar },
            ],
          },
          {
            path: 'ingresos',
            Component: IngresosPage,
          },
        ],
      },
    ],
  },
]);
