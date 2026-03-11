import { useEffect, useState } from 'react';
import { KPICard } from '../components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getIsDemoMode } from '../config';
import { 
  Wallet, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  DollarSign,
  Activity
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api, Asset } from '../services/api';

// Mock data para gr?ficos
const patrimonioEvolucion = [
  { mes: 'Oct', valor: 28000 },
  { mes: 'Nov', valor: 29500 },
  { mes: 'Dic', valor: 30200 },
  { mes: 'Ene', valor: 31000 },
  { mes: 'Feb', valor: 30500 },
  { mes: 'Mar', valor: 32750 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [statsData, assetsData] = await Promise.all([
      api.getDashboardStats(),
      api.getAssets()
    ]);
    setStats(statsData);
    setAssets(assetsData);
  };

  if (!stats) {
    return <div>Cargando...</div>;
  }

  // Preparar datos para el gr?fico de distribuci?n
  const distribucionData = [
    { name: 'CEDEARs', value: assets.filter(a => a.tipo === 'CEDEAR').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'Acciones', value: assets.filter(a => a.tipo === 'Accion').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'Bonos', value: assets.filter(a => a.tipo === 'Bono').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'Cripto', value: assets.filter(a => a.tipo === 'Cripto').reduce((sum, a) => sum + a.valorActual, 0) },
    { name: 'D?lar', value: 10000 },
    { name: 'Efectivo', value: 5000 },
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
    <div className="space-y-8">
      {getIsDemoMode() && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
          Modo demo: no es necesario iniciar sesi?n. Pod?s explorar el dashboard con datos de ejemplo.
        </div>
      )}
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Patrimonio Total"
          value={formatCurrency(stats.patrimonioTotal)}
          change={stats.variacionDiariaPorcentaje}
          changeLabel="hoy"
          icon={<Wallet className="w-5 h-5 text-[var(--info)]" />}
          trend={stats.variacionDiariaPorcentaje > 0 ? 'up' : 'down'}
        />
        <KPICard
          title="Ganancia/P?rdida Total"
          value={formatCurrency(stats.gananciaTotal)}
          change={stats.gananciaPorcentaje}
          icon={<TrendingUp className="w-5 h-5 text-[var(--success)]" />}
          trend={stats.gananciaTotal > 0 ? 'up' : 'down'}
        />
        <KPICard
          title="Gastos del Mes"
          value={formatCurrency(stats.gastosDelMes)}
          icon={<ArrowUpFromLine className="w-5 h-5 text-[var(--danger)]" />}
        />
        <KPICard
          title="Ingresos del Mes"
          value={formatCurrency(stats.ingresosDelMes)}
          icon={<ArrowDownToLine className="w-5 h-5 text-[var(--success)]" />}
        />
        <KPICard
          title="Flujo de Caja"
          value={formatCurrency(stats.flujoDeCaja)}
          icon={<Activity className="w-5 h-5 text-[var(--info)]" />}
          trend={stats.flujoDeCaja > 0 ? 'up' : 'down'}
        />
        <KPICard
          title="Variaci?n Diaria"
          value={formatCurrency(stats.variacionDiaria)}
          change={stats.variacionDiariaPorcentaje}
          icon={<DollarSign className="w-5 h-5 text-[var(--success)]" />}
          trend={stats.variacionDiaria > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Gr?ficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evoluci?n del Patrimonio */}
        <Card>
          <CardHeader>
            <CardTitle>Evoluci?n del Patrimonio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patrimonioEvolucion}>
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
                  dataKey="valor" 
                  stroke="var(--info)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--info)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuci?n de Activos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuci?n de Activos</CardTitle>
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
      </div>

      {/* Tabla de Exposici?n por Activo */}
      <Card>
        <CardHeader>
          <CardTitle>Exposici?n por Activo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left py-3 px-4">Activo</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Sector</th>
                  <th className="text-right py-3 px-4">Cantidad</th>
                  <th className="text-right py-3 px-4">Precio Promedio</th>
                  <th className="text-right py-3 px-4">Precio Actual</th>
                  <th className="text-right py-3 px-4">Total Invertido</th>
                  <th className="text-right py-3 px-4">Valor Actual</th>
                  <th className="text-right py-3 px-4">Resultado USD</th>
                  <th className="text-right py-3 px-4">Resultado %</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{asset.nombre}</td>
                    <td className="py-3 px-4">{asset.tipo}</td>
                    <td className="py-3 px-4">{asset.sector || '-'}</td>
                    <td className="py-3 px-4 text-right">{asset.cantidad}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(asset.precioPromedio)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(asset.precioActual)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(asset.totalInvertido)}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(asset.valorActual)}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={asset.resultado > 0 ? 'success' : 'danger'}>
                        {formatCurrency(asset.resultado)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={asset.resultadoPorcentaje > 0 ? 'success' : 'danger'}>
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
    </div>
  );
}
