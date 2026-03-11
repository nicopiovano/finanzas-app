import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Plus, DollarSign } from 'lucide-react';
import { api, Transaction } from '../services/api';

export function Dolar() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'compra' as 'compra' | 'venta',
    cantidad: '',
    precio: '',
    fecha: new Date().toISOString().split('T')[0],
    origen: 'Banco',
    observaciones: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await api.getDolarTransactions();
    setTransactions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseFloat(formData.cantidad);
    const precio = parseFloat(formData.precio);
    
    await api.addDolarTransaction({
      tipo: formData.tipo,
      cantidad,
      precio,
      total: cantidad * precio,
      fecha: formData.fecha,
      origen: formData.origen,
      observaciones: formData.observaciones
    });

    setIsModalOpen(false);
    setFormData({
      tipo: 'compra',
      cantidad: '',
      precio: '',
      fecha: new Date().toISOString().split('T')[0],
      origen: 'Banco',
      observaciones: ''
    });
    loadTransactions();
  };

  // Calcular totales
  const totalUSD = transactions.reduce((sum, t) => {
    return t.tipo === 'compra' ? sum + t.cantidad : sum - t.cantidad;
  }, 0);

  const totalInvertidoARS = transactions
    .filter(t => t.tipo === 'compra')
    .reduce((sum, t) => sum + t.total, 0);

  const precioPromedio = totalUSD > 0 ? totalInvertidoARS / totalUSD : 0;

  const formatCurrency = (value: number, currency: 'USD' | 'ARS' = 'USD') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--info)]/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-[var(--info)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total USD Acumulado</p>
                <p className="text-2xl font-semibold">{formatCurrency(totalUSD)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Precio Promedio Ponderado</p>
              <p className="text-2xl font-semibold">{formatCurrency(precioPromedio, 'ARS')}</p>
              <p className="text-xs text-muted-foreground mt-1">por USD</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Invertido</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalInvertidoARS, 'ARS')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Historial de Operaciones</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Operación
        </Button>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-right py-3 px-4">Precio (ARS)</th>
                  <th className="text-right py-3 px-4">Cantidad (USD)</th>
                  <th className="text-right py-3 px-4">Total (ARS)</th>
                  <th className="text-left py-3 px-4">Origen</th>
                  <th className="text-left py-3 px-4">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">{new Date(transaction.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="py-3 px-4">
                      <Badge variant={transaction.tipo === 'compra' ? 'success' : 'danger'}>
                        {transaction.tipo.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">{formatCurrency(transaction.precio, 'ARS')}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(transaction.cantidad)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(transaction.total, 'ARS')}</td>
                    <td className="py-3 px-4">{transaction.origen || '-'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{transaction.observaciones || '-'}</td>
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
        title="Nueva Operación Dólar"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm mb-2">Tipo de Operación</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  formData.tipo === 'compra'
                    ? 'bg-[var(--success)] text-white border-[var(--success)]'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => setFormData({ ...formData, tipo: 'compra' })}
              >
                Compra
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  formData.tipo === 'venta'
                    ? 'bg-[var(--danger)] text-white border-[var(--danger)]'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => setFormData({ ...formData, tipo: 'venta' })}
              >
                Venta
              </button>
            </div>
          </div>

          <Input
            label="Cantidad USD"
            type="number"
            step="0.01"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
            required
          />

          <Input
            label="Precio por USD (ARS)"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
          />

          {formData.cantidad && formData.precio && (
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground">Total en ARS</p>
              <p className="text-xl font-semibold">
                {formatCurrency(parseFloat(formData.cantidad) * parseFloat(formData.precio), 'ARS')}
              </p>
            </div>
          )}

          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            required
          />

          <Select
            label="Origen"
            value={formData.origen}
            onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
            options={[
              { value: 'Banco', label: 'Banco' },
              { value: 'Persona', label: 'Persona' },
              { value: 'Mercado Pago', label: 'Mercado Pago' },
              { value: 'Otro', label: 'Otro' }
            ]}
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
