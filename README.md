# 💰 Finanzas App — Frontend

Aplicación de finanzas personales para seguimiento de inversiones, dólar, CEDEARs, acciones e ingresos. Desarrollada con **React + Vite**.

---

## 🛠 Stack

| Tecnología | Uso |
|------------|-----|
| **React 18** | UI library |
| **Vite** | Bundler y dev server |
| **Tailwind CSS 4** | Estilos |
| **Zustand** | Estado global |
| **React Router 7** | Enrutamiento SPA |
| **Radix UI + shadcn/ui** | Componentes UI |
| **Recharts** | Gráficos y visualización |
| **Axios** | Llamadas HTTP al backend |
| **MUI** | Componentes adicionales (iconos, etc.) |

---

## 📋 Requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** o **pnpm**
- Backend Laravel corriendo en `http://localhost:8001` (ver `docker-compose.yml` en la raíz)

---

## 🚀 Cómo levantar el proyecto

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Modo desarrollo

```bash
npm run dev
```

La app estará en **http://localhost:5173**.

### 3. Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para desplegar.

---

## 📁 Estructura principal

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/     # Componentes reutilables
│   │   │   ├── auth/       # Auth: login, registro, rutas protegidas
│   │   │   ├── ui/         # shadcn/ui (button, card, dialog, etc.)
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── pages/          # Vistas: Dashboard, Dólar, Acciones, CEDEARs, etc.
│   │   ├── stores/         # Zustand (auth store)
│   │   ├── context/        # React Context (FinanceContext)
│   │   ├── lib/            # API client (Axios)
│   │   ├── utils/          # Cálculos y helpers
│   │   ├── routes.ts       # Definición de rutas
│   │   └── App.tsx         # Componente raíz
│   ├── styles/             # Estilos globales
│   └── main.tsx            # Entry point
├── public/                 # Assets estáticos
├── vite.config.ts
└── package.json
```

---
## 📍c Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Compila para producción en `dist/` |
>>>>>>> cfc8a9d (Readme)

---

## 💡 Notas

- Usa **`@`** como alias para `src/` (configurado en `vite.config.ts`).
- La autenticación se maneja con **Laravel Sanctum** desde el backend.
- El estado financiero global se gestiona vía **FinanceContext** y **Zustand**.
