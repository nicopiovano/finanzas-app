import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';

const tabs = [
  { path: '/cedears-acciones/compras', label: 'Compras', icon: ShoppingCart },
  { path: '/cedears-acciones/ventas', label: 'Ventas', icon: TrendingUp },
  { path: '/cedears-acciones/rendimiento', label: 'Rendimiento', icon: BarChart3 },
];

export function CedearsAccionesPage() {
  const location = useLocation();
  
  // Determinar si la ruta actual está activa (incluye la ruta raíz)
  const isActiveTab = (tabPath: string) => {
    if (location.pathname === '/cedears-acciones' && tabPath === '/cedears-acciones/compras') {
      return true;
    }
    return location.pathname === tabPath;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cedears y Acciones</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestión de cedears y acciones</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveTab(tab.path);

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium
                  ${isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Outlet />
    </div>
  );
}
