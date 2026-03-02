import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { 
  calcularTenenciaActual, 
  calcularPromedioPonderado,
  calcularGananciaCDRs,
  calcularGananciaAcciones,
  formatCurrency
} from '../../utils/calculations';

export function RendimientoCedearsAcciones() {
  const { cdrTransactions, accionTransactions, currency, precios } = useFinance();
  const tenenciasCDRs = calcularTenenciaActual(cdrTransactions);
  const tenenciasAcciones = calcularTenenciaActual(accionTransactions);
  const gananciasCDRs = calcularGananciaCDRs(cdrTransactions, precios);
  const gananciasAcciones = calcularGananciaAcciones(accionTransactions, precios);

  const tickersCDRs = Array.from(new Set(cdrTransactions.map(t => t.ticker)));
  const tickersAcciones = Array.from(new Set(accionTransactions.map(t => t.ticker)));

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia Realizada Total</p>
          <p className={`text-2xl font-bold ${(gananciasCDRs.realizada + gananciasAcciones.realizada) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(gananciasCDRs.realizada + gananciasAcciones.realizada, currency)}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia No Realizada Total</p>
          <p className={`text-2xl font-bold ${(gananciasCDRs.noRealizada + gananciasAcciones.noRealizada) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(gananciasCDRs.noRealizada + gananciasAcciones.noRealizada, currency)}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia Total</p>
          <p className={`text-2xl font-bold ${(gananciasCDRs.total + gananciasAcciones.total) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(gananciasCDRs.total + gananciasAcciones.total, currency)}
          </p>
        </div>
      </div>

      {/* Sección de Cedears */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Rendimiento de Cedears
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Análisis de rendimiento de tus posiciones en cedears
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia Realizada</p>
            <p className={`text-2xl font-bold ${gananciasCDRs.realizada >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciasCDRs.realizada, currency)}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia No Realizada</p>
            <p className={`text-2xl font-bold ${gananciasCDRs.noRealizada >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciasCDRs.noRealizada, currency)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia Total</p>
            <p className={`text-2xl font-bold ${gananciasCDRs.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciasCDRs.total, currency)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Ticker
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Tenencia
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Precio Actual
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Variación 24h
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Precio Prom. Compra
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Ganancia/Pérdida
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tickersCDRs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No hay cedears en cartera
                    </td>
                  </tr>
                ) : (
                  tickersCDRs.map((ticker) => {
                    const tenencia = tenenciasCDRs.get(ticker) || 0;
                    if (tenencia <= 0) return null;

                    const precioActual = precios.cdrs[ticker] || 0;
                    const compras = cdrTransactions.filter(t => t.tipo === 'compra' && t.ticker === ticker);
                    const precioPromedio = calcularPromedioPonderado(compras, 'compra');
                    const ganancia = tenencia * (precioActual - precioPromedio);
                    const gananciaPercent = ((precioActual - precioPromedio) / precioPromedio) * 100;
                    const valorTotal = tenencia * precioActual;
                    
                    const variacion = (Math.random() * 6 - 3);

                    return (
                      <tr key={ticker} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                          {ticker}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                          {tenencia.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                          ${precioActual.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className={`inline-flex items-center gap-1 ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variacion >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {variacion >= 0 ? '+' : ''}{variacion.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                          ${precioPromedio.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className={ganancia >= 0 ? 'text-green-600' : 'text-red-600'}>
                            <div className="font-medium">
                              ${ganancia.toFixed(2)}
                            </div>
                            <div className="text-xs">
                              {gananciaPercent >= 0 ? '+' : ''}{gananciaPercent.toFixed(2)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                          ${valorTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sección de Acciones */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Rendimiento de Acciones
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Análisis de rendimiento de tus posiciones en acciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia Realizada</p>
            <p className={`text-2xl font-bold ${gananciasAcciones.realizada >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciasAcciones.realizada, currency)}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia No Realizada</p>
            <p className={`text-2xl font-bold ${gananciasAcciones.noRealizada >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciasAcciones.noRealizada, currency)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia Total</p>
            <p className={`text-2xl font-bold ${gananciasAcciones.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciasAcciones.total, currency)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Ticker
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Tenencia
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Precio Actual
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Variación 24h
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Precio Prom. Compra
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Ganancia/Pérdida
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tickersAcciones.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No hay acciones en cartera
                    </td>
                  </tr>
                ) : (
                  tickersAcciones.map((ticker) => {
                    const tenencia = tenenciasAcciones.get(ticker) || 0;
                    if (tenencia <= 0) return null;

                    const precioActual = precios.acciones[ticker] || 0;
                    const compras = accionTransactions.filter(t => t.tipo === 'compra' && t.ticker === ticker);
                    const precioPromedio = calcularPromedioPonderado(compras, 'compra');
                    const ganancia = tenencia * (precioActual - precioPromedio);
                    const gananciaPercent = ((precioActual - precioPromedio) / precioPromedio) * 100;
                    const valorTotal = tenencia * precioActual;
                    
                    const variacion = (Math.random() * 8 - 4);

                    return (
                      <tr key={ticker} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                          {ticker}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                          {tenencia.toLocaleString('es-AR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                          ${precioActual.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className={`inline-flex items-center gap-1 ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variacion >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {variacion >= 0 ? '+' : ''}{variacion.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                          ${precioPromedio.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className={ganancia >= 0 ? 'text-green-600' : 'text-red-600'}>
                            <div className="font-medium">
                              ${ganancia.toFixed(2)}
                            </div>
                            <div className="text-xs">
                              {gananciaPercent >= 0 ? '+' : ''}{gananciaPercent.toFixed(2)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                          ${valorTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
