import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { calcularPromedioDolarCompra, calcularTotalDolaresComprados, formatCurrency } from '../../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function HistorialDolar() {
  const { dolarCompras, currency, precios } = useFinance();

  const promedioCompra = calcularPromedioDolarCompra(dolarCompras);
  const totalDolares = calcularTotalDolaresComprados(dolarCompras);
  const precioActual = precios.dolar.mep;
  const gananciaNoRealizada = totalDolares * (precioActual - promedioCompra);
  const gananciaPercent = ((precioActual - promedioCompra) / promedioCompra) * 100;

  // Datos para el gráfico de evolución del precio promedio
  const comprasSorted = [...dolarCompras].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  
  const evolucionData = comprasSorted.map((compra, index) => {
    const comprasHastaAhora = comprasSorted.slice(0, index + 1);
    const totalCantidad = comprasHastaAhora.reduce((sum, c) => sum + c.cantidad, 0);
    const totalValor = comprasHastaAhora.reduce((sum, c) => sum + (c.cantidad * c.precio), 0);
    const promedio = totalValor / totalCantidad;

    return {
      fecha: format(new Date(compra.fecha), 'dd/MM'),
      promedio: promedio,
      precioCompra: compra.precio,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Historial y Análisis
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Seguimiento de tus compras de dólares
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Precio Promedio Compra</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $ {promedioCompra.toFixed(2)}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total en Cartera</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            US$ {totalDolares.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Precio Actual (MEP)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $ {precioActual.toFixed(2)}
          </p>
        </div>

        <div className={`rounded-lg p-4 border ${
          gananciaNoRealizada >= 0
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganancia No Realizada</p>
          <p className={`text-2xl font-bold ${gananciaNoRealizada >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(gananciaNoRealizada, currency)}
          </p>
          <p className={`text-sm mt-1 ${gananciaNoRealizada >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {gananciaPercent >= 0 ? '+' : ''}{gananciaPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Gráfico */}
      {evolucionData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Evolución del Precio Promedio de Compra
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="fecha" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#f3f4f6' }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Line 
                type="monotone" 
                dataKey="promedio" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Precio Promedio"
              />
              <Line 
                type="monotone" 
                dataKey="precioCompra" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Precio Compra"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Análisis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Análisis de Compras
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Total de compras realizadas</span>
            <span className="font-semibold text-gray-900 dark:text-white">{dolarCompras.length}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Inversión total (ARS)</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              $ {(totalDolares * promedioCompra).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Valor actual (ARS)</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              $ {(totalDolares * precioActual).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Diferencia vs precio actual</span>
            <span className={`font-semibold ${precioActual > promedioCompra ? 'text-green-600' : 'text-red-600'}`}>
              $ {Math.abs(precioActual - promedioCompra).toFixed(2)} ({Math.abs(gananciaPercent).toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
