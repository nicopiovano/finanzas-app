import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Plus } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api, Expense } from '../services/api';

const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

// Mock data para evolución mensual
const monthlyEvolution = [
  { mes: 'Oct', total: 1500 },
  { mes: 'Nov', total: 1700 },
  { mes: 'Dic', total: 2100 },
  { mes: 'Ene', total: 1600 },
  { mes: 'Feb', total: 1800 },
  { mes: 'Mar', total: 1200 },
];

export function Gastos() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoria: 'Supermercado' as Expense['categoria'],
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    medioPago: '',
    observaciones: ''
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await api.getExpenses();
    setExpenses(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await api.addExpense({
      categoria: formData.categoria,
      monto: parseFloat(formData.monto),
      fecha: formData.fecha,
      medioPago: formData.medioPago,
      observaciones: formData.observaciones
    });

    setIsModalOpen(false);
    setFormData({
      categoria: 'Supermercado',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      medioPago: '',
      observaciones: ''
    });
    loadExpenses();
  };

  const totalAcumulado = expenses.reduce((sum, expense) => sum + expense.monto, 0);

  // Preparar datos para gráfico donut por categoría
  const categoryData = [
    { name: 'Supermercado', value: expenses.filter(e => e.categoria === 'Supermercado').reduce((sum, e) => sum + e.monto, 0) },
    { name: 'Alquiler', value: expenses.filter(e => e.categoria === 'Alquiler').reduce((sum, e) => sum + e.monto, 0) },
    { name: 'Tarjeta', value: expenses.filter(e => e.categoria === 'Tarjeta').reduce((sum, e) => sum + e.monto, 0) },
    { name: 'Servicios', value: expenses.filter(e => e.categoria === 'Servicios').reduce((sum, e) => sum + e.monto, 0) },
    { name: 'Transporte', value: expenses.filter(e => e.categoria === 'Transporte').reduce((sum, e) => sum + e.monto, 0) },
    { name: 'Otros', value: expenses.filter(e => e.categoria === 'Otros').reduce((sum, e) => sum + e.monto, 0) },
  ].filter(item => item.value > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Gastos</h2>
          <p className="text-muted-foreground">Total Acumulado: {formatCurrency(totalAcumulado)}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Gasto
        </Button>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolución Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--danger)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--danger)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Categoría</th>
                  <th className="text-right py-3 px-4">Monto</th>
                  <th className="text-left py-3 px-4">Medio de Pago</th>
                  <th className="text-left py-3 px-4">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">{new Date(expense.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-[var(--danger)]/10 text-[var(--danger)] rounded-md text-sm">
                        {expense.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[var(--danger)]">
                      {formatCurrency(expense.monto)}
                    </td>
                    <td className="py-3 px-4">{expense.medioPago || '-'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{expense.observaciones || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Gasto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value as Expense['categoria'] })}
            options={[
              { value: 'Supermercado', label: 'Supermercado' },
              { value: 'Alquiler', label: 'Alquiler' },
              { value: 'Tarjeta', label: 'Tarjeta' },
              { value: 'Servicios', label: 'Servicios' },
              { value: 'Transporte', label: 'Transporte' },
              { value: 'Otros', label: 'Otros' }
            ]}
          />

          <Input
            label="Monto (USD)"
            type="number"
            step="0.01"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            required
          />

          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            required
          />

          <Input
            label="Medio de Pago"
            value={formData.medioPago}
            onChange={(e) => setFormData({ ...formData, medioPago: e.target.value })}
            placeholder="Ej: Tarjeta, Efectivo, Transferencia"
          />

          <Textarea
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Notas adicionales..."
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
