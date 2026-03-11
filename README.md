# Finanzas App — Frontend

Aplicación de finanzas personales: dashboard, dólar, inversiones, ingresos y gastos. Desarrollada con **React 18 + Vite**.

- **Backend API:** [finanzas-app-api](https://github.com/nicopiovano/finanzas-app-api) (Laravel)

---

## Stack

| Tecnología        | Uso                    |
|-------------------|------------------------|
| React 18          | UI                     |
| Vite 6            | Build y dev server     |
| Tailwind CSS 4    | Estilos                |
| React Router 7    | Rutas                  |
| Zustand           | Estado global (auth)   |
| Axios             | Cliente HTTP al API    |
| Radix UI / shadcn | Componentes UI         |
| Recharts          | Gráficos               |
| MUI (icons)       | Iconos                 |

---

## Requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** o pnpm
- Backend Laravel en marcha (p. ej. `http://localhost:8002`, ver `VITE_API_URL`)

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (puerto 5172)
npm run dev
```

Abre **http://localhost:5172**.

---

## Build

```bash
npm run build
```

Salida en `dist/`.

---

## Estructura del proyecto

```
frontend/
├── public/              # Assets estáticos (favicon, etc.)
├── src/
│   ├── app/
│   │   ├── components/   # Componentes reutilizables
│   │   │   ├── figma/    # Componentes ligados a Figma (si aplica)
│   │   │   ├── auth/     # Login, registro, rutas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── ui/       # Card, Button, Modal, etc.
│   │   ├── context/      # React Context (si se usa)
│   │   ├── hooks/        # useTheme, etc.
│   │   ├── lib/          # Cliente API (axios)
│   │   ├── pages/        # Vistas por ruta
│   │   │   ├── auth/     # Login, Register
│   │   │   └── ingresos/
│   │   ├── services/     # Llamadas al API
│   │   ├── stores/       # Zustand (auth)
│   │   ├── utils/        # Helpers (cn, etc.)
│   │   ├── config.ts     # AUTH_ENABLED, demo, etc.
│   │   ├── routes.ts     # Definición de rutas
│   │   └── App.tsx
│   ├── styles/           # CSS global (Tailwind, temas)
│   ├── types/            # Tipos TypeScript compartidos
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

---

## Variables de entorno

| Variable         | Descripción                    | Por defecto           |
|------------------|--------------------------------|------------------------|
| `VITE_API_URL`   | URL base del backend Laravel  | `http://localhost:8002` |
| `VITE_DEMO_MODE` | Modo demo (sin login)         | —                      |

---

## Rutas

| Ruta            | Descripción     |
|-----------------|-----------------|
| `/`             | Dashboard       |
| `/login`        | Inicio de sesión |
| `/register`     | Registro       |
| `/dolar`        | Dólar          |
| `/inversiones`  | Inversiones    |
| `/ingresos`     | Ingresos       |
| `/gastos`       | Gastos         |
| `/configuracion`| Configuración (admin) |

---

## Configuración local

- **Auth:** `src/app/config.ts` — `AUTH_ENABLED`, `FORCE_ADMIN`, y modo demo (`?demo` en la URL).
- **API:** `src/app/lib/api.ts` — `API_BASE_URL` (o `VITE_API_URL`).
- Alias `@` en Vite apunta a `src/` (imports tipo `@/app/...`).
