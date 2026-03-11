#!/bin/bash
# Ejecutar desde la raíz del repo que contendrá backend/ y frontend/ como submódulos.
# Repos en GitHub: finanzas-app (frontend), finanzas-app-api (backend).

set -e
cd "$(dirname "$0")"

BACKEND_URL="git@github.com:nicopiovano/finanzas-app-api.git"
FRONTEND_URL="git@github.com:nicopiovano/finanzas-app.git"

echo "1. Subiendo backend a su repo..."
(cd backend && git push -u origin main)

echo "2. Subiendo frontend a su repo..."
(cd frontend && git push -u origin main)

echo "3. Eliminando carpetas locales (ya están en sus repos)..."
rm -rf backend frontend

echo "4. Añadiendo backend y frontend como submódulos..."
git submodule add "$BACKEND_URL" backend
git submodule add "$FRONTEND_URL" frontend

echo "5. Quitando backend/frontend del .gitignore..."
sed -i '/^\/backend\/$/d; /^\/frontend\/$/d' .gitignore

echo "6. Commit y push..."
git add .gitignore .gitmodules backend frontend
git commit -m "chore: add backend and frontend as submodules"
git push origin main

echo "Listo. finanzas-app ahora solo tiene backend/ y frontend/ como submódulos."
