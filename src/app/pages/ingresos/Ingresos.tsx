import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, Income } from '../../services/api';

// Mock data para gráfico mensual
const monthlyData = [
  { mes: 'Oct', total: 2800 },
  { mes: 'Nov', total: 3100 },
  { mes: 'Dic', total: 3500 },
  { mes: 'Ene', total: 3000 },
  { mes: 'Feb', total: 3200 },
  { mes: 'Mar', total: 3150 },
];

export function Ingresos() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'Sueldo' as Income['tipo'],
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    const data = await api.getIncomes();
    setIncomes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await api.addIncome({
      tipo: formData.tipo,
      monto: parseFloat(formData.monto),
      fecha: formData.fecha,
      observaciones: formData.observaciones
    });

    setIsModalOpen(false);
    setFormData({
      tipo: 'Sueldo',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
    loadIncomes();
  };

  const totalAcumulado = incomes.reduce((sum, income) => sum + income.monto, 0);

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
          <h2 className="text-2xl font-semibold mb-1">Ingresos</h2>
          <p className="text-muted-foreground">Total Acumulado: {formatCurrency(totalAcumulado)}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ingreso
        </Button>
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Bar dataKey="total" fill="var(--success)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-right py-3 px-4">Monto</th>
                  <th className="text-left py-3 px-4">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">{new Date(income.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-md text-sm">
                        {income.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[var(--success)]">
                      {formatCurrency(income.monto)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{income.observaciones || '-'}</td>
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
        title="Nuevo Ingreso"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Tipo de Ingreso"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Income['tipo'] })}
            options={[
              { value: 'Sueldo', label: 'Sueldo' },
              { value: 'Dividendos', label: 'Dividendos' },
              { value: 'Intereses', label: 'Intereses' },
              { value: 'Extra', label: 'Extra' }
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
