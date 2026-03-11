# Finanzas App

Proyecto con **backend** y **frontend** como repositorios Git independientes (submódulos).

- **Frontend:** [nicopiovano/finanzas-app](https://github.com/nicopiovano/finanzas-app) (React + Vite)
- **Backend:** [nicopiovano/finanzas-app-api](https://github.com/nicopiovano/finanzas-app-api) (Laravel)

## Estructura

```
finanzas-app/
├── backend/   → submódulo → finanzas-app-api (Laravel)
├── frontend/  → submódulo → finanzas-app (Vue/React)
└── README.md
```

## Primera vez: enlazar backend y frontend como submódulos

Si ya tienes las carpetas `backend/` y `frontend/` con su código y su propio `git`, y los repos en GitHub existen:

1. **Ejecuta el script** (sube cada uno a su repo y los enlaza como submódulos):
   ```bash
   ./setup-submodules.sh
   ```
   Si prefieres hacerlo a mano, sube cada uno y luego añade los submódulos como en el script.

## Clonar el proyecto

```bash
git clone --recurse-submodules git@github.com:nicopiovano/finanzas-app.git
# o, si ya clonaste sin submódulos:
git submodule update --init --recursive
```

## Trabajar con backend o frontend

Cada carpeta es un repo aparte: haz `git status`, `commit`, `push` dentro de `backend/` o `frontend/` como siempre.
