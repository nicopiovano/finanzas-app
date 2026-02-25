import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

const tabs = [
  { path: '/cdrs/compras', label: 'Compras', icon: ShoppingCart },
  { path: '/cdrs/ventas', label: 'Ventas', icon: TrendingUp },
  { path: '/cdrs/precios', label: 'Precios Actuales', icon: DollarSign },
];

export function CDRsPage() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CDRs</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestión de certificados de depósito</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium
                  ${isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Outlet />
    </div>
  );
}
