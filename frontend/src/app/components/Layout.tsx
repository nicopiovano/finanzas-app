import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

function SignatureFooter() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-4">
      <div className="pointer-events-auto max-w-xl rounded-2xl border border-black/10 bg-white/75 px-3 py-2 text-xs text-zinc-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100">
        <span className="font-medium">Desarrollado con</span>
        <span className="mx-2 text-zinc-600 dark:text-zinc-300">
          React · Tailwind · Laravel · AI
        </span>
        <a
          href="https://nico-piovano-porfolio.vercel.app/es"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          <span className="font-medium">by Nico Piovano</span>
        </a>
      </div>
    </div>
  );
}

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <SignatureFooter />
    </>
  );
}
