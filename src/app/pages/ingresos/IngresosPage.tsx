import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Plus, Building2, Smartphone } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { formatCurrency } from '../../utils/calculations';

export function IngresosPage() {
  const { ingresos, addIngreso, currency } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'banco' | 'mercadopago'>('todos');
  const [formData, setFormData] = useState({
    fecha: format(new Date(), 'yyyy-MM-dd'),
    monto: '',
    origen: 'banco' as 'banco' | 'mercadopago',
    nota: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIngreso({
      fecha: new Date(formData.fecha),
      monto: parseFloat(formData.monto),
      origen: formData.origen,
      nota: formData.nota,
    });
    setFormData({
      fecha: format(new Date(), 'yyyy-MM-dd'),
      monto: '',
      origen: 'banco',
      nota: '',
    });
    setShowForm(false);
  };

  const ingresosFiltrados = filter === 'todos' 
    ? ingresos 
    : ingresos.filter(i => i.origen === filter);

  const totalGeneral = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const totalBanco = ingresos.filter(i => i.origen === 'banco').reduce((sum, i) => sum + i.monto, 0);
  const totalMercadoPago = ingresos.filter(i => i.origen === 'mercadopago').reduce((sum, i) => sum + i.monto, 0);

  // Total del mes actual
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  const totalMesActual = ingresos
    .filter(i => {
      const fecha = new Date(i.fecha);
      return fecha >= startMonth && fecha <= endMonth;
    })
    .reduce((sum, i) => sum + i.monto, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ingresos</h1>
        <p className="text-gray-600 dark:text-gray-400">Registro de ingresos por fuente</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total General</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalGeneral, currency)}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Banco</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalBanco, currency)}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Mercado Pago</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalMercadoPago, currency)}
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Este Mes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalMesActual, currency)}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('banco')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === 'banco'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Banco
          </button>
          <button
            onClick={() => setFilter('mercadopago')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === 'mercadopago'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mercado Pago
          </button>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Ingreso
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Registrar Ingreso</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monto (ARS)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  placeholder="50000.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Origen
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="banco"
                    checked={formData.origen === 'banco'}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value as 'banco' })}
                    className="w-4 h-4"
                  />
                  <Building2 className="w-4 h-4" />
                  <span className="text-gray-900 dark:text-white">Banco</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="mercadopago"
                    checked={formData.origen === 'mercadopago'}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value as 'mercadopago' })}
                    className="w-4 h-4"
                  />
                  <Smartphone className="w-4 h-4" />
                  <span className="text-gray-900 dark:text-white">Mercado Pago</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nota / Descripción
              </label>
              <input
                type="text"
                required
                value={formData.nota}
                onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                placeholder="Salario febrero"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Ingreso
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Origen
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Nota
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {ingresosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay ingresos registrados
                  </td>
                </tr>
              ) : (
                ingresosFiltrados
                  .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                  .map((ingreso) => (
                    <tr key={ingreso.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {format(new Date(ingreso.fecha), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {ingreso.origen === 'banco' ? (
                            <>
                              <Building2 className="w-4 h-4 text-green-600" />
                              <span className="text-gray-900 dark:text-white">Banco</span>
                            </>
                          ) : (
                            <>
                              <Smartphone className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-900 dark:text-white">Mercado Pago</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {ingreso.nota}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                        {formatCurrency(ingreso.monto, currency)}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
