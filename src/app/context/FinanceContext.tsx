import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth';

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

export interface Precios {
  cdrs: Record<string, number>;
  acciones: Record<string, number>;
  dolar: { oficial: number; mep: number; blue: number };
}

const DEFAULT_PRECIOS: Precios = {
  cdrs: {},
  acciones: {},
  dolar: { oficial: 0, mep: 0, blue: 0 },
};

interface FinanceContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;

  // CDRs
  cdrTransactions: CDRTransaction[];
  addCDRTransaction: (transaction: Omit<CDRTransaction, 'id'>) => Promise<void>;

  // Acciones
  accionTransactions: AccionTransaction[];
  addAccionTransaction: (transaction: Omit<AccionTransaction, 'id'>) => Promise<void>;

  // Dólar
  dolarCompras: DolarCompra[];
  addDolarCompra: (compra: Omit<DolarCompra, 'id'>) => Promise<void>;

  // Ingresos
  ingresos: Ingreso[];
  addIngreso: (ingreso: Omit<Ingreso, 'id'>) => Promise<void>;

  // Precios
  precios: Precios;

  // Loading
  loading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function parseTransaction(raw: Record<string, unknown>): CDRTransaction | AccionTransaction {
  return {
    id: String(raw.id),
    ticker: raw.ticker as string,
    cantidad: Number(raw.cantidad),
    precio: Number(raw.precio),
    fecha: new Date(raw.fecha as string),
    tipo: raw.tipo as 'compra' | 'venta',
  };
}

function parseDolarCompra(raw: Record<string, unknown>): DolarCompra {
  return {
    id: String(raw.id),
    cantidad: Number(raw.cantidad),
    precio: Number(raw.precio),
    fecha: new Date(raw.fecha as string),
  };
}

function parseIngreso(raw: Record<string, unknown>): Ingreso {
  return {
    id: String(raw.id),
    fecha: new Date(raw.fecha as string),
    monto: Number(raw.monto),
    origen: raw.origen as 'banco' | 'mercadopago',
    nota: (raw.nota as string) || '',
  };
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('ARS');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [cdrTransactions, setCdrTransactions] = useState<CDRTransaction[]>([]);
  const [accionTransactions, setAccionTransactions] = useState<AccionTransaction[]>([]);
  const [dolarCompras, setDolarCompras] = useState<DolarCompra[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [precios, setPrecios] = useState<Precios>(DEFAULT_PRECIOS);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((s) => s.user?.id);

  // Fetch all data from API when user is logged in
  useEffect(() => {
    if (userId == null) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function fetchAll() {
      try {
        const [cedears, acciones, dolares, ingresosRes, preciosRes] = await Promise.all([
          api.get('/api/transactions', { params: { mercado: 'cedear' } }),
          api.get('/api/transactions', { params: { mercado: 'accion' } }),
          api.get('/api/dolar-compras'),
          api.get('/api/ingresos'),
          api.get('/api/precios'),
        ]);
        if (cancelled) return;

        const toList = (x: unknown): Record<string, unknown>[] =>
          Array.isArray(x) ? x : [];

        setCdrTransactions(toList(cedears.data?.data).map(parseTransaction));
        setAccionTransactions(toList(acciones.data?.data).map(parseTransaction));
        setDolarCompras(toList(dolares.data?.data).map(parseDolarCompra));
        setIngresos(toList(ingresosRes.data?.data).map(parseIngreso));
        setPrecios((preciosRes.data?.data as Precios) ?? DEFAULT_PRECIOS);
      } catch (err) {
        if (!cancelled) console.error('Error fetching finance data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [userId]);

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

  const addCDRTransaction = useCallback(async (transaction: Omit<CDRTransaction, 'id'>) => {
    const res = await api.post('/api/transactions', {
      ...transaction,
      fecha: formatDate(transaction.fecha),
      mercado: 'cedear',
    });
    setCdrTransactions((prev) => [...prev, parseTransaction(res.data.data)]);
  }, []);

  const addAccionTransaction = useCallback(async (transaction: Omit<AccionTransaction, 'id'>) => {
    const res = await api.post('/api/transactions', {
      ...transaction,
      fecha: formatDate(transaction.fecha),
      mercado: 'accion',
    });
    setAccionTransactions((prev) => [...prev, parseTransaction(res.data.data)]);
  }, []);

  const addDolarCompra = useCallback(async (compra: Omit<DolarCompra, 'id'>) => {
    const res = await api.post('/api/dolar-compras', {
      ...compra,
      fecha: formatDate(compra.fecha),
    });
    setDolarCompras((prev) => [...prev, parseDolarCompra(res.data.data)]);
  }, []);

  const addIngreso = useCallback(async (ingreso: Omit<Ingreso, 'id'>) => {
    const res = await api.post('/api/ingresos', {
      ...ingreso,
      fecha: formatDate(ingreso.fecha),
    });
    setIngresos((prev) => [...prev, parseIngreso(res.data.data)]);
  }, []);

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
        precios,
        loading,
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
