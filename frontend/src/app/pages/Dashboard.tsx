import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { KPICard } from '../components/KPICard';
import { Wallet, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { 
  formatCurrency, 
  calcularGananciaCDRs, 
  calcularGananciaAcciones,
  calcularTenenciaActual,
  formatPercent
} from '../utils/calculations';
import { AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Dashboard() {
  const { currency, cdrTransactions, accionTransactions, dolarCompras, ingresos, precios } = useFinance();

  // Cálculos
  const gananciaCDRs = calcularGananciaCDRs(cdrTransactions, precios);
  const gananciaAcciones = calcularGananciaAcciones(accionTransactions, precios);
  const gananciaTotal = gananciaCDRs.total + gananciaAcciones.total;
  const gananciaDiaria = gananciaTotal * 0.025; // Mock 2.5%

  // Patrimonio por tipo
  const tenenciasCDRs = calcularTenenciaActual(cdrTransactions);
  const tenenciasAcciones = calcularTenenciaActual(accionTransactions);

  let valorCDRs = 0;
  tenenciasCDRs.forEach((cantidad, ticker) => {
    const precio = precios.cdrs[ticker] || 0;
    valorCDRs += cantidad * precio;
  });

  let valorAcciones = 0;
  tenenciasAcciones.forEach((cantidad, ticker) => {
    const precio = precios.acciones[ticker] || 0;
    valorAcciones += cantidad * precio;
  });

  const totalDolares = dolarCompras.reduce((sum, c) => sum + c.cantidad, 0);
  const valorDolares = totalDolares * precios.dolar.mep;

  const totalEfectivo = ingresos.reduce((sum, i) => sum + i.monto, 0);

  const patrimonioTotal = valorCDRs + valorAcciones + valorDolares + totalEfectivo;

  // Datos para gráficos
  const distribucionData = [
    { name: 'CDRs', value: valorCDRs, color: '#3b82f6' },
    { name: 'Acciones', value: valorAcciones, color: '#8b5cf6' },
    { name: 'Dólares', value: valorDolares, color: '#10b981' },
    { name: 'Efectivo', value: totalEfectivo, color: '#f59e0b' },
  ];

  // Mock: evolución del patrimonio (últimos 30 días)
  const evolucionData = Array.from({ length: 30 }, (_, i) => ({
    dia: i + 1,
    patrimonio: patrimonioTotal * (0.85 + (i / 30) * 0.15),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visión general de tus finanzas</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Patrimonio Total"
          value={formatCurrency(patrimonioTotal, currency)}
          icon={Wallet}
          tooltip="Suma de todos tus activos"
        />
        <KPICard
          title="Ganancia Total"
          value={formatCurrency(gananciaTotal, currency)}
          change={formatPercent((gananciaTotal / patrimonioTotal) * 100)}
          changeType={gananciaTotal >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
        />
        <KPICard
          title="Ganancia Diaria"
          value={formatCurrency(gananciaDiaria, currency)}
          change={formatPercent(2.5)}
          changeType={gananciaDiaria >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
        />
        <KPICard
          title="Dólares en Cartera"
          value={`US$ ${totalDolares.toLocaleString('es-AR')}`}
          icon={PieChart}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución del patrimonio */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Evolución del Patrimonio (30 días)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={evolucionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="dia" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#f3f4f6' }}
                formatter={(value: number) => formatCurrency(value, currency)}
              />
              <Area 
                type="monotone" 
                dataKey="patrimonio" 
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por tipo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución por Tipo de Activo
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={distribucionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribucionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => formatCurrency(value, currency)}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalle de exposición */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Exposición Detallada por Activo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CDRs</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(valorCDRs, currency)}
            </p>
            <p className={`text-sm mt-1 ${gananciaCDRs.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciaCDRs.total, currency)} ({formatPercent((gananciaCDRs.total / valorCDRs) * 100)})
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Acciones</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(valorAcciones, currency)}
            </p>
            <p className={`text-sm mt-1 ${gananciaAcciones.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gananciaAcciones.total, currency)} ({formatPercent((gananciaAcciones.total / valorAcciones) * 100)})
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dólares</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(valorDolares, currency)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalDolares.toLocaleString('es-AR')} USD
            </p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Efectivo ARS</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalEfectivo, currency)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              De ingresos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
