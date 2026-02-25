import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';

const tabs = [
  { path: '/acciones/compras', label: 'Compras', icon: ShoppingCart },
  { path: '/acciones/ventas', label: 'Ventas', icon: TrendingUp },
  { path: '/acciones/rendimiento', label: 'Rendimiento', icon: BarChart3 },
];

export function AccionesPage() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Acciones</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestión de acciones locales</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium
                  ${isActive
                    ? 'border-purple-600 text-purple-600'
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
