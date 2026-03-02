import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, Building2, Briefcase, Users } from 'lucide-react';

export function PreciosDolar() {
  const { precios } = useFinance();

  const cotizaciones = [
    {
      tipo: 'Oficial',
      compra: precios.dolar.oficial,
      venta: precios.dolar.oficial * 1.02,
      variacion: -0.15,
      icon: Building2,
      color: 'blue',
    },
    {
      tipo: 'MEP',
      compra: precios.dolar.mep,
      venta: precios.dolar.mep * 1.015,
      variacion: 1.8,
      icon: Briefcase,
      color: 'purple',
    },
    {
      tipo: 'Blue',
      compra: precios.dolar.blue,
      venta: precios.dolar.blue * 1.02,
      variacion: 2.3,
      icon: Users,
      color: 'green',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Cotizaciones del Dólar
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Precios actualizados de los diferentes tipos de dólar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cotizaciones.map((cot) => {
          const Icon = cot.icon;
          return (
            <div
              key={cot.tipo}
              className={`rounded-lg p-6 border ${colorClasses[cot.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dólar {cot.tipo}
                  </h3>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${
                    cot.variacion >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cot.variacion >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {cot.variacion >= 0 ? '+' : ''}{cot.variacion}%
                  </div>
                </div>
                <Icon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Compra</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${cot.compra.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Venta</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${cot.venta.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Spread: ${(cot.venta - cot.compra).toFixed(2)} ({(((cot.venta - cot.compra) / cot.compra) * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info adicional */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Nota:</strong> Los precios son referenciales y pueden variar según el broker o casa de cambio. 
          Última actualización: {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
