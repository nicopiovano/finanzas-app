// Servicio API mock - Reemplazar con llamadas reales a tu backend

export interface Transaction {
  id: string;
  fecha: string;
  tipo: 'compra' | 'venta';
  cantidad: number;
  precio: number;
  total: number;
  origen?: string;
  observaciones?: string;
}

export interface Asset {
  id: string;
  nombre: string;
  tipo: 'CEDEAR' | 'Accion' | 'Bono' | 'Cripto' | 'Dolar' | 'Efectivo';
  sector?: string;
  cantidad: number;
  precioPromedio: number;
  precioActual: number;
  totalInvertido: number;
  valorActual: number;
  resultado: number;
  resultadoPorcentaje: number;
}

export interface Income {
  id: string;
  tipo: 'Sueldo' | 'Dividendos' | 'Intereses' | 'Extra';
  monto: number;
  fecha: string;
  observaciones?: string;
}

export interface Expense {
  id: string;
  categoria: 'Supermercado' | 'Alquiler' | 'Tarjeta' | 'Servicios' | 'Transporte' | 'Otros';
  monto: number;
  fecha: string;
  medioPago?: string;
  observaciones?: string;
}

// Mock data
const mockAssets: Asset[] = [
  {
    id: '1',
    nombre: 'AAPL',
    tipo: 'CEDEAR',
    sector: 'Tecnología',
    cantidad: 50,
    precioPromedio: 150,
    precioActual: 175,
    totalInvertido: 7500,
    valorActual: 8750,
    resultado: 1250,
    resultadoPorcentaje: 16.67
  },
  {
    id: '2',
    nombre: 'GOOGL',
    tipo: 'CEDEAR',
    sector: 'Tecnología',
    cantidad: 30,
    precioPromedio: 120,
    precioActual: 110,
    totalInvertido: 3600,
    valorActual: 3300,
    resultado: -300,
    resultadoPorcentaje: -8.33
  },
  {
    id: '3',
    nombre: 'YPF',
    tipo: 'Accion',
    sector: 'Energía',
    cantidad: 100,
    precioPromedio: 25,
    precioActual: 32,
    totalInvertido: 2500,
    valorActual: 3200,
    resultado: 700,
    resultadoPorcentaje: 28
  },
  {
    id: '4',
    nombre: 'BTC',
    tipo: 'Cripto',
    sector: 'Cripto',
    cantidad: 0.5,
    precioPromedio: 45000,
    precioActual: 52000,
    totalInvertido: 22500,
    valorActual: 26000,
    resultado: 3500,
    resultadoPorcentaje: 15.56
  }
];

const mockDolarTransactions: Transaction[] = [
  {
    id: '1',
    fecha: '2026-02-15',
    tipo: 'compra',
    cantidad: 1000,
    precio: 1050,
    total: 1050000,
    origen: 'Banco',
    observaciones: 'Compra mensual'
  },
  {
    id: '2',
    fecha: '2026-01-20',
    tipo: 'compra',
    cantidad: 500,
    precio: 1020,
    total: 510000,
    origen: 'Mercado Pago'
  }
];

const mockIncomes: Income[] = [
  {
    id: '1',
    tipo: 'Sueldo',
    monto: 3000,
    fecha: '2026-03-01',
    observaciones: 'Salario mensual'
  },
  {
    id: '2',
    tipo: 'Dividendos',
    monto: 150,
    fecha: '2026-02-28'
  }
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    categoria: 'Supermercado',
    monto: 400,
    fecha: '2026-03-02',
    medioPago: 'Tarjeta'
  },
  {
    id: '2',
    categoria: 'Alquiler',
    monto: 800,
    fecha: '2026-03-01',
    medioPago: 'Transferencia'
  }
];

// API Functions
export const api = {
  // Assets
  getAssets: async (): Promise<Asset[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAssets), 300);
    });
  },
  
  addAsset: async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
    return new Promise((resolve) => {
      const newAsset = { ...asset, id: Date.now().toString() };
      mockAssets.push(newAsset);
      setTimeout(() => resolve(newAsset), 300);
    });
  },

  // Dolar Transactions
  getDolarTransactions: async (): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDolarTransactions), 300);
    });
  },

  addDolarTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    return new Promise((resolve) => {
      const newTransaction = { ...transaction, id: Date.now().toString() };
      mockDolarTransactions.unshift(newTransaction);
      setTimeout(() => resolve(newTransaction), 300);
    });
  },

  // Incomes
  getIncomes: async (): Promise<Income[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockIncomes), 300);
    });
  },

  addIncome: async (income: Omit<Income, 'id'>): Promise<Income> => {
    return new Promise((resolve) => {
      const newIncome = { ...income, id: Date.now().toString() };
      mockIncomes.unshift(newIncome);
      setTimeout(() => resolve(newIncome), 300);
    });
  },

  // Expenses
  getExpenses: async (): Promise<Expense[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExpenses), 300);
    });
  },

  addExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    return new Promise((resolve) => {
      const newExpense = { ...expense, id: Date.now().toString() };
      mockExpenses.unshift(newExpense);
      setTimeout(() => resolve(newExpense), 300);
    });
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const assets = await api.getAssets();
    const incomes = await api.getIncomes();
    const expenses = await api.getExpenses();

    const patrimonioTotal = assets.reduce((sum, asset) => sum + asset.valorActual, 0) + 15000; // +15k USD cash
    const totalInvertido = assets.reduce((sum, asset) => sum + asset.totalInvertido, 0);
    const gananciaTotal = patrimonioTotal - totalInvertido - 15000;
    const gananciaPorcentaje = ((gananciaTotal / totalInvertido) * 100) || 0;
    
    const currentMonth = new Date().getMonth();
    const ingresosDelMes = incomes
      .filter(i => new Date(i.fecha).getMonth() === currentMonth)
      .reduce((sum, i) => sum + i.monto, 0);
    
    const gastosDelMes = expenses
      .filter(e => new Date(e.fecha).getMonth() === currentMonth)
      .reduce((sum, e) => sum + e.monto, 0);

    return {
      patrimonioTotal,
      variacionDiaria: 245,
      variacionDiariaPorcentaje: 0.8,
      gananciaTotal,
      gananciaPorcentaje,
      gastosDelMes,
      ingresosDelMes,
      flujoDeCaja: ingresosDelMes - gastosDelMes
    };
  }
};
