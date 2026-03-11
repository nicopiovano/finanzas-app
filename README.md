# Finanzas App

Proyecto con **backend** y **frontend** como repositorios Git independientes (submódulos).

## Estructura

```
finanzas-app/
├── backend/   → apunta a su propio repo (Laravel)
├── frontend/  → apunta a su propio repo (Vue/React)
└── README.md
```

## Primera vez: crear los repos y enlazarlos

1. **Crea dos repos vacíos en GitHub** (misma cuenta que este repo):
   - `finanzas-app-backend`
   - `finanzas-app-frontend`

2. **Sube el código de cada carpeta a su repo:**
   ```bash
   cd backend && git push -u origin main && cd ..
   cd frontend && git push -u origin main && cd ..
   ```

3. **Convierte las carpetas en submódulos** (solo una vez):
   ```bash
   rm -rf backend frontend
   git submodule add git@github.com:nicopiovano/finanzas-app-backend.git backend
   git submodule add git@github.com:nicopiovano/finanzas-app-frontend.git frontend
   git add .gitmodules backend frontend
   git commit -m "chore: add backend and frontend as submodules"
   git push origin main
   ```

4. Quita `backend/` y `frontend/` del `.gitignore` del repo raíz (ya no se ignoran, son submódulos).

## Clonar el proyecto

```bash
git clone --recurse-submodules git@github.com:nicopiovano/finanzas-app.git
# o, si ya clonaste sin submódulos:
git submodule update --init --recursive
```

## Trabajar con backend o frontend

Cada carpeta es un repo aparte: haz `git status`, `commit`, `push` dentro de `backend/` o `frontend/` como siempre.
