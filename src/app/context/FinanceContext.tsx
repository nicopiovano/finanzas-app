import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'ARS' | 'USD';

export interface CDRTransaction {
  id: string;
  ticker: string;
  cantidad: number;
  precio: number;
  fecha: Date;
  tipo: 'compra' | 'venta';
}

export interface AccionTransaction {
  id: string;
  ticker: string;
  cantidad: number;
  precio: number;
  fecha: Date;
  tipo: 'compra' | 'venta';
}

export interface DolarCompra {
  id: string;
  cantidad: number;
  precio: number;
  fecha: Date;
}

export interface Ingreso {
  id: string;
  fecha: Date;
  monto: number;
  origen: 'banco' | 'mercadopago';
  nota: string;
}

interface FinanceContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  
  // CDRs
  cdrTransactions: CDRTransaction[];
  addCDRTransaction: (transaction: Omit<CDRTransaction, 'id'>) => void;
  
  // Acciones
  accionTransactions: AccionTransaction[];
  addAccionTransaction: (transaction: Omit<AccionTransaction, 'id'>) => void;
  
  // Dólar
  dolarCompras: DolarCompra[];
  addDolarCompra: (compra: Omit<DolarCompra, 'id'>) => void;
  
  // Ingresos
  ingresos: Ingreso[];
  addIngreso: (ingreso: Omit<Ingreso, 'id'>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Mock data
const mockCDRTransactions: CDRTransaction[] = [
  { id: '1', ticker: 'AAPL', cantidad: 10, precio: 150.5, fecha: new Date('2026-02-01'), tipo: 'compra' },
  { id: '2', ticker: 'GOOGL', cantidad: 5, precio: 2800, fecha: new Date('2026-02-05'), tipo: 'compra' },
  { id: '3', ticker: 'MSFT', cantidad: 8, precio: 380, fecha: new Date('2026-02-10'), tipo: 'compra' },
  { id: '4', ticker: 'AAPL', cantidad: 3, precio: 155, fecha: new Date('2026-02-15'), tipo: 'venta' },
];

const mockAccionTransactions: AccionTransaction[] = [
  { id: '1', ticker: 'YPF', cantidad: 100, precio: 1250, fecha: new Date('2026-02-01'), tipo: 'compra' },
  { id: '2', ticker: 'GGAL', cantidad: 50, precio: 3400, fecha: new Date('2026-02-08'), tipo: 'compra' },
  { id: '3', ticker: 'PAM', cantidad: 75, precio: 890, fecha: new Date('2026-02-12'), tipo: 'compra' },
];

const mockDolarCompras: DolarCompra[] = [
  { id: '1', cantidad: 1000, precio: 985, fecha: new Date('2026-01-15') },
  { id: '2', cantidad: 500, precio: 1020, fecha: new Date('2026-02-01') },
  { id: '3', cantidad: 800, precio: 1035, fecha: new Date('2026-02-10') },
];

const mockIngresos: Ingreso[] = [
  { id: '1', fecha: new Date('2026-02-01'), monto: 500000, origen: 'banco', nota: 'Salario enero' },
  { id: '2', fecha: new Date('2026-02-05'), monto: 85000, origen: 'mercadopago', nota: 'Freelance proyecto web' },
  { id: '3', fecha: new Date('2026-02-10'), monto: 120000, origen: 'banco', nota: 'Bono semestral' },
  { id: '4', fecha: new Date('2026-02-15'), monto: 45000, origen: 'mercadopago', nota: 'Venta usados' },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('ARS');
  const [darkMode, setDarkMode] = useState(() => {
    // Leer del localStorage o usar preferencia del sistema
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [cdrTransactions, setCdrTransactions] = useState<CDRTransaction[]>(mockCDRTransactions);
  const [accionTransactions, setAccionTransactions] = useState<AccionTransaction[]>(mockAccionTransactions);
  const [dolarCompras, setDolarCompras] = useState<DolarCompra[]>(mockDolarCompras);
  const [ingresos, setIngresos] = useState<Ingreso[]>(mockIngresos);

  // Aplicar darkmode al elemento HTML
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const addCDRTransaction = (transaction: Omit<CDRTransaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setCdrTransactions([...cdrTransactions, newTransaction]);
  };

  const addAccionTransaction = (transaction: Omit<AccionTransaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setAccionTransactions([...accionTransactions, newTransaction]);
  };

  const addDolarCompra = (compra: Omit<DolarCompra, 'id'>) => {
    const newCompra = { ...compra, id: Date.now().toString() };
    setDolarCompras([...dolarCompras, newCompra]);
  };

  const addIngreso = (ingreso: Omit<Ingreso, 'id'>) => {
    const newIngreso = { ...ingreso, id: Date.now().toString() };
    setIngresos([...ingresos, newIngreso]);
  };

  return (
    <FinanceContext.Provider
      value={{
        currency,
        setCurrency,
        darkMode,
        setDarkMode,
        cdrTransactions,
        addCDRTransaction,
        accionTransactions,
        addAccionTransaction,
        dolarCompras,
        addDolarCompra,
        ingresos,
        addIngreso,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
