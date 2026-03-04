import { useNavigate } from 'react-router';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../stores/auth';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const authLoading = useAuthStore((s) => s.loading);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 hidden md:block capitalize">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
            {user?.name ?? ''}
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={authLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">{authLoading ? 'Saliendo…' : 'Salir'}</span>
        </button>
      </div>
    </header>
  );
}
