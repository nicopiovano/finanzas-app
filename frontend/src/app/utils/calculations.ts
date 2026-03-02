import { CDRTransaction, AccionTransaction, DolarCompra, Precios } from '../context/FinanceContext';

export type { Precios };

export function calcularPromedioPonderado(
  transactions: (CDRTransaction | AccionTransaction)[],
  tipo: 'compra' | 'venta'
): number {
  const filtered = transactions.filter(t => t.tipo === tipo);
  if (filtered.length === 0) return 0;
  
  const totalCantidad = filtered.reduce((sum, t) => sum + t.cantidad, 0);
  const totalValor = filtered.reduce((sum, t) => sum + (t.cantidad * t.precio), 0);
  
  return totalValor / totalCantidad;
}

export function calcularTenenciaActual(transactions: (CDRTransaction | AccionTransaction)[]): Map<string, number> {
  const tenencias = new Map<string, number>();
  
  transactions.forEach(t => {
    const current = tenencias.get(t.ticker) || 0;
    if (t.tipo === 'compra') {
      tenencias.set(t.ticker, current + t.cantidad);
    } else {
      tenencias.set(t.ticker, current - t.cantidad);
    }
  });
  
  return tenencias;
}

export function calcularGananciaCDRs(transactions: CDRTransaction[], precios: Precios): {
  realizada: number;
  noRealizada: number;
  total: number;
} {
  const tenencias = calcularTenenciaActual(transactions);
  
  // Ganancia realizada (de ventas)
  const ventas = transactions.filter(t => t.tipo === 'venta');
  let gananciaRealizada = 0;
  
  ventas.forEach(venta => {
    const compras = transactions.filter(t => t.tipo === 'compra' && t.ticker === venta.ticker);
    const precioCompraPromedio = calcularPromedioPonderado(compras, 'compra');
    gananciaRealizada += venta.cantidad * (venta.precio - precioCompraPromedio);
  });
  
  // Ganancia no realizada (posiciones actuales)
  let gananciaNoRealizada = 0;
  tenencias.forEach((cantidad, ticker) => {
    if (cantidad > 0) {
      const precioActual = precios.cdrs[ticker] || 0;
      const compras = transactions.filter(t => t.tipo === 'compra' && t.ticker === ticker);
      const precioCompraPromedio = calcularPromedioPonderado(compras, 'compra');
      gananciaNoRealizada += cantidad * (precioActual - precioCompraPromedio);
    }
  });
  
  return {
    realizada: gananciaRealizada,
    noRealizada: gananciaNoRealizada,
    total: gananciaRealizada + gananciaNoRealizada,
  };
}

export function calcularGananciaAcciones(transactions: AccionTransaction[], precios: Precios): {
  realizada: number;
  noRealizada: number;
  total: number;
} {
  const tenencias = calcularTenenciaActual(transactions);
  
  const ventas = transactions.filter(t => t.tipo === 'venta');
  let gananciaRealizada = 0;
  
  ventas.forEach(venta => {
    const compras = transactions.filter(t => t.tipo === 'compra' && t.ticker === venta.ticker);
    const precioCompraPromedio = calcularPromedioPonderado(compras, 'compra');
    gananciaRealizada += venta.cantidad * (venta.precio - precioCompraPromedio);
  });
  
  let gananciaNoRealizada = 0;
  tenencias.forEach((cantidad, ticker) => {
    if (cantidad > 0) {
      const precioActual = precios.acciones[ticker] || 0;
      const compras = transactions.filter(t => t.tipo === 'compra' && t.ticker === ticker);
      const precioCompraPromedio = calcularPromedioPonderado(compras, 'compra');
      gananciaNoRealizada += cantidad * (precioActual - precioCompraPromedio);
    }
  });
  
  return {
    realizada: gananciaRealizada,
    noRealizada: gananciaNoRealizada,
    total: gananciaRealizada + gananciaNoRealizada,
  };
}

export function calcularPromedioDolarCompra(compras: DolarCompra[]): number {
  if (compras.length === 0) return 0;
  
  const totalCantidad = compras.reduce((sum, c) => sum + c.cantidad, 0);
  const totalValor = compras.reduce((sum, c) => sum + (c.cantidad * c.precio), 0);
  
  return totalValor / totalCantidad;
}

export function calcularTotalDolaresComprados(compras: DolarCompra[]): number {
  return compras.reduce((sum, c) => sum + c.cantidad, 0);
}

export function formatCurrency(value: number, currency: 'ARS' | 'USD'): string {
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  
  const prefix = currency === 'ARS' ? '$' : 'US$';
  const sign = value < 0 ? '-' : '';
  
  return `${sign}${prefix} ${formatted}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
