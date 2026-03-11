import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { api, Asset } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export function Inversiones() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<'Todas' | 'CEDEAR' | 'Accion' | 'Bono' | 'Cripto'>('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'compra' as 'compra' | 'venta',
    nombre: '',
    tipoInversion: 'CEDEAR' as Asset['tipo'],
    sector: 'Tecnología',
    cantidad: '',
    precioUnitario: ''
  });

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (activeTab === 'Todas') {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter(a => a.tipo === activeTab));
    }
  }, [activeTab, assets]);

  const loadAssets = async () => {
    const data = await api.getAssets();
    setAssets(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseFloat(formData.cantidad);
    const precio = parseFloat(formData.precioUnitario);
    
    await api.addAsset({
      nombre: formData.nombre,
      tipo: formData.tipoInversion,
      sector: formData.sector,
      cantidad,
      precioPromedio: precio,
      precioActual: precio,
      totalInvertido: cantidad * precio,
      valorActual: cantidad * precio,
      resultado: 0,
      resultadoPorcentaje: 0
    });

    setIsModalOpen(false);
    setFormData({
      tipo: 'compra',
      nombre: '',
      tipoInversion: 'CEDEAR',
      sector: 'Tecnología',
      cantidad: '',
      precioUnitario: ''
    });
    loadAssets();
  };

  // Calcular distribución por tipo
  const distribucionData = [
    { name: 'CEDEARs', value: assets.filter(a => a.tipo === 'CEDEAR').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'Acciones', value: assets.filter(a => a.tipo === 'Accion').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'Bonos', value: assets.filter(a => a.tipo === 'Bono').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'Cripto', value: assets.filter(a => a.tipo === 'Cripto').reduce((sum, a) => sum + a.valorActual, 0) },
  ].filter(item => item.value > 0);

  const totalPortfolio = distribucionData.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const tabs: Array<'Todas' | 'CEDEAR' | 'Accion' | 'Bono' | 'Cripto'> = ['Todas', 'CEDEAR', 'Accion', 'Bono', 'Cripto'];

  return (
    <div className="space-y-6">
      {/* Panel Superior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Distribución */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribución del Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribucionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribucionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cards de Resumen */}
        <div className="space-y-4">
          {distribucionData.map((item, index) => (
            <Card key={item.name}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                    <p className="text-lg font-semibold">{formatCurrency(item.value)}</p>
                  </div>
                  <div className="text-right">
                    <div 
                      className="w-3 h-3 rounded-full mb-1" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <p className="text-sm text-muted-foreground">
                      {((item.value / totalPortfolio) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'Accion' ? 'Acciones' : tab}
            </button>
          ))}
        </div>
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
                  <th className="text-left py-3 px-4">Activo</th>
                  <th className="text-left py-3 px-4">Sector</th>
                  <th className="text-right py-3 px-4">Cantidad</th>
                  <th className="text-right py-3 px-4">Precio Promedio</th>
                  <th className="text-right py-3 px-4">Precio Actual</th>
                  <th className="text-right py-3 px-4">Total Invertido</th>
                  <th className="text-right py-3 px-4">Valor Actual</th>
                  <th className="text-right py-3 px-4">Ganancia/Pérdida USD</th>
                  <th className="text-right py-3 px-4">Ganancia/Pérdida %</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{asset.nombre}</td>
                    <td className="py-3 px-4">{asset.sector || '-'}</td>
                    <td className="py-3 px-4 text-right">{asset.cantidad}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(asset.precioPromedio)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(asset.precioActual)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(asset.totalInvertido)}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(asset.valorActual)}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={asset.resultado > 0 ? 'success' : asset.resultado < 0 ? 'danger' : 'neutral'}>
                        {formatCurrency(asset.resultado)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={asset.resultadoPorcentaje > 0 ? 'success' : asset.resultadoPorcentaje < 0 ? 'danger' : 'neutral'}>
                        {asset.resultadoPorcentaje > 0 ? '+' : ''}{asset.resultadoPorcentaje.toFixed(2)}%
                      </Badge>
                    </td>
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
        title="Nueva Operación de Inversión"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Activo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: AAPL, YPF, BTC"
            required
          />

          <Select
            label="Tipo de Inversión"
            value={formData.tipoInversion}
            onChange={(e) => setFormData({ ...formData, tipoInversion: e.target.value as Asset['tipo'] })}
            options={[
              { value: 'CEDEAR', label: 'CEDEAR' },
              { value: 'Accion', label: 'Acción' },
              { value: 'Bono', label: 'Bono' },
              { value: 'Cripto', label: 'Cripto' }
            ]}
          />

          <Select
            label="Sector"
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            options={[
              { value: 'Energía', label: 'Energía' },
              { value: 'Tecnología', label: 'Tecnología' },
              { value: 'Consumo', label: 'Consumo' },
              { value: 'Finanzas', label: 'Finanzas' },
              { value: 'Construcción', label: 'Construcción' },
              { value: 'Gobierno', label: 'Gobierno' },
              { value: 'Otro', label: 'Otro' }
            ]}
          />

          <Input
            label="Cantidad"
            type="number"
            step="0.01"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
            required
          />

          <Input
            label="Precio Unitario (USD)"
            type="number"
            step="0.01"
            value={formData.precioUnitario}
            onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
            required
          />

          {formData.cantidad && formData.precioUnitario && (
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground">Total Operación</p>
              <p className="text-xl font-semibold">
                {formatCurrency(parseFloat(formData.cantidad) * parseFloat(formData.precioUnitario))}
              </p>
            </div>
          )}

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
