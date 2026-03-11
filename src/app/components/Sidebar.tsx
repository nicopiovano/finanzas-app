import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore, ADMIN_ROLE } from '../stores/auth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems: { path: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dolar', label: 'Dólar', icon: DollarSign },
  { path: '/inversiones', label: 'Inversiones', icon: TrendingUp },
  { path: '/ingresos', label: 'Ingresos', icon: Wallet },
  { path: '/gastos', label: 'Gastos', icon: BarChart3 },
  { path: '/configuracion', label: 'Configuración', icon: Settings, adminOnly: true },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const isAdmin = useAuthStore((s) => s.user?.role === ADMIN_ROLE);
  const visibleItems = menuItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside 
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
    >
      {/* Logo/Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="font-bold text-xl text-gray-900 dark:text-white">
            FinanzasApp
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2026 FinanzasApp
          </p>
        </div>
      )}
    </aside>
  );
}
