import React from 'react';
import { useNavigate } from 'react-router';
import { useFinance } from '../context/FinanceContext';
import { useAuthStore } from '../stores/auth';
import { Moon, Sun, TrendingUp, TrendingDown, LogOut, User } from 'lucide-react';
import { formatCurrency, calcularGananciaCDRs, calcularGananciaAcciones } from '../utils/calculations';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Header() {
  const navigate = useNavigate();
  const { currency, setCurrency, darkMode, setDarkMode, cdrTransactions, accionTransactions } = useFinance();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const authLoading = useAuthStore((s) => s.loading);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  // Cálculos rápidos
  const gananciaCDRs = calcularGananciaCDRs(cdrTransactions);
  const gananciaAcciones = calcularGananciaAcciones(accionTransactions);
  const gananciaTotal = gananciaCDRs.total + gananciaAcciones.total;
  
  // Mock: ganancia diaria (2.5% del total)
  const gananciaDiaria = gananciaTotal * 0.025;

  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      {/* Resumen rápido */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ganancia Total</p>
          <p className={`text-lg font-bold ${gananciaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(gananciaTotal, currency)}
          </p>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="flex items-center gap-2">
          {gananciaDiaria >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Variación Diaria</p>
            <p className={`text-sm font-semibold ${gananciaDiaria >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciaDiaria, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 hidden md:block capitalize">
          {today}
        </p>

        {/* Selector de moneda */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setCurrency('ARS')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              currency === 'ARS'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            ARS
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              currency === 'USD'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            USD
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Usuario y logout */}
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
