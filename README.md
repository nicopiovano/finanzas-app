# Finanzas App

Proyecto con **backend** y **frontend** como repositorios Git independientes (submódulos).

## Estructura

```
finanzas-app/
├── backend/   → apunta a su propio repo (Laravel)
├── frontend/  → apunta a su propio repo (Vue/React)
└── README.md
```

## Primera vez: crear los repos y enlazarlos como submódulos

1. **Crea dos repos vacíos en GitHub** (misma cuenta que este repo):
   - `finanzas-app-backend`
   - `finanzas-app-frontend`

2. **Ejecuta el script** (sube backend y frontend a sus repos y los enlaza como submódulos):
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
